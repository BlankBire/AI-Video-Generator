import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import RunwayML from '@runwayml/sdk';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

/** 
 * Sử dụng Gemini (@google/genai) để "thông não" kịch bản thô.
 * Chuyển sang v1 để tránh lỗi 404 v1beta.
 */
async function refineManualScript(rawText: string, apiKey: string) {
  // Use v1 API version as v1beta might be unstable/deprecated for this model
  const ai = new GoogleGenAI({ apiKey }); 
  const modelId = 'gemini-1.5-flash'; 
  
  // Prompt nhẹ nhàng hơn, tập trung vào nội dung kịch bản
  const prompt = `Cải thiện kịch bản quảng cáo đồ ăn sau: "${rawText}". 
  Hãy chia nó thành các cảnh quay sinh động. 
  Trả về duy nhất dữ liệu dưới dạng JSON array: [{"sceneOrder":1, "title":"", "visualDescription":"", "audioScript":""}]. 
  Đảm bảo kịch bản tự nhiên, hấp dẫn, không máy móc.`;
  
  const result = await ai.models.generateContent({
    model: modelId,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });
  
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleanJson = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleanJson);
}

export async function POST(req: Request) {
  try {
    const { scriptId: inputScriptId, manualScript, config } = await req.json();

    const runwayApiKey = process.env.RUNWAYML_API_KEY;
    const googleApiKey = process.env.GOOGLE_API_KEY;
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    
    let script: any = null;
    let finalScriptId = inputScriptId;

    if (finalScriptId) {
      script = await prisma.videoScript.findUnique({ where: { id: finalScriptId } });
    }

    let scenes: any[] = [];
    const defaultProjectId = '123e4567-e89b-12d3-a456-426614174000';

    if (manualScript && manualScript.trim()) {
       scenes = await refineManualScript(manualScript, googleApiKey || '');
       const newScript = await prisma.videoScript.create({
         data: {
             project: { connect: { id: script?.projectId || defaultProjectId } },
             content: scenes as any
         }
       });
       script = newScript;
       finalScriptId = newScript.id;
    } else if (script) {
       scenes = script.content as any[];
    }

    if (!scenes || scenes.length === 0) return NextResponse.json({ error: 'No script' }, { status: 400 });

    const runway = new RunwayML({ apiKey: runwayApiKey || 'mock-key' });
    const newGen = await prisma.videoGeneration.create({
      data: {
        project: { connect: { id: script?.projectId || defaultProjectId } },
        script: finalScriptId ? { connect: { id: finalScriptId } } : undefined,
        generationNo: 1,
        resolution: config?.resolution || '720p',
        aspectRatio: config?.aspectRatio || '16:9',
        status: 'processing',
      }
    });
    const generationId = newGen.id;

    const results = [];
    const ratio = config?.aspectRatio === '16:9' ? '1280:720' : '720:1280';
    const motion = Math.floor((config?.motionIntensity || 50) / 10) || 5; 

    const audioDir = path.join(process.cwd(), 'public', 'audio');
    if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

    for (const scene of scenes) {
      console.log(`[V8-DEBUG] PROCESSING SCENE ${scene.sceneOrder}...`);
      const safeAudioScript = (scene.audioScript || '').toString().trim();
      let audioUrl = '';

      if (safeAudioScript) {
        const fileName = `audio_${finalScriptId}_${scene.sceneOrder}.mp3`; 
        const filePath = path.join(audioDir, fileName);
        
        console.log(`[HF-AUDIO] Generating...`);
        const hfResponse = await fetch(`https://router.huggingface.co/hf-inference/models/facebook/mms-tts-vie`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${hfApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ inputs: safeAudioScript })
        });
        
        if (!hfResponse.ok) {
           const errText = await hfResponse.text();
           throw new Error(`TTS Failed: ${hfResponse.status} - ${errText}`);
        }

        const buffer = Buffer.from(await hfResponse.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        audioUrl = `http://localhost:3001/audio/${fileName}`;
      }

      // --- VIDEO ---
      const visualPrompt = `${scene.visualDescription || scene.title}. Style: ${config?.style}.`;
      console.log(`[RUNWAY] Generating with veo3.1_fast...`);
      const res = await (runway.textToVideo as any).create({ 
        model: 'veo3.1_fast', 
        promptText: visualPrompt, 
        ratio, 
        motion 
      });

      let task = await runway.tasks.retrieve(res.id);
      while (task.status !== 'SUCCEEDED' && task.status !== 'FAILED') {
        await new Promise(r => setTimeout(r, 7000));
        task = await runway.tasks.retrieve(res.id);
      }

      if (task.status === 'SUCCEEDED') {
        const videoUrl = (task as any).output?.[0] || '';
        const dbScene = await prisma.videoScene.create({
          data: { generationId, sceneOrder: scene.sceneOrder, visualPrompt, audioScript: safeAudioScript, videoClipUrl: videoUrl, audioUrl },
        });
        results.push(dbScene);
      } else {
        throw new Error(`Runway Task Failed: ${res.id}`);
      }
    }

    await prisma.videoGeneration.update({ where: { id: generationId }, data: { status: 'completed' } });
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('[API-CRITICAL]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
