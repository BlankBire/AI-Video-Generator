import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { topic, tone, projectId } = await req.json();

    if (!topic || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Initialize New GenAI SDK (Google AI Studio Mode)
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }

    console.log(`[V8-API-KEY] Initializing, Key: ${apiKey.substring(0, 8)}...`);

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Bạn là một biên kịch TikTok chuyên nghiệp.
Hãy tạo kịch bản video ngắn cho món: ${topic}.
Tone: ${tone}.
Yêu cầu: Trả về một mảng JSON (Array) gồm 2 đối tượng cảnh quay.
Mỗi đối tượng có:
- sceneOrder: số thứ tự
- title: tên cảnh
- visualDescription: mô tả hình ảnh cực kỳ chi tiết cho AI tạo video (như RunwayML), mô tả bằng tiếng Anh để AI hiểu tốt nhất.
- audioScript: lời thoại tiếng Việt.

Chỉ trả về chuỗi JSON thô, không kèm markdown, không kèm giải thích.`;

    const modelId = 'gemini-flash-latest'; 
    console.log(`[V8-API-KEY] Calling Model: ${modelId}`);

    // 2. Generate Content
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const contentText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('[V8-DEBUG] RAW GENAI RESPONSE:', contentText);

    const jsonString = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
    let scenes = [];
    try {
        scenes = JSON.parse(jsonString);
    } catch (parseError) {
        console.error('[V8-DEBUG] JSON Parse Failed. Trying to extract array...');
        const arrayMatch = jsonString.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            scenes = JSON.parse(arrayMatch[0]);
        } else {
            throw new Error('Không thể parse kịch bản từ Gemini: ' + contentText.substring(0, 50));
        }
    }
    
    if (!Array.isArray(scenes) || scenes.length === 0) {
        throw new Error('Kịch bản rỗng. Hãy thử lại với chủ đề khác.');
    }

    scenes = scenes.slice(0, 2);

    // 2. Ensure Project Exists (Resilience for Mock/Test IDs)
    const existingProject = await prisma.videoProject.findUnique({ where: { id: projectId } });
    if (!existingProject) {
      console.log('Project not found, creating a dummy project for testing...');
      await prisma.user.upsert({
        where: { id: projectId },
        update: {},
        create: { id: projectId, email: `test_${projectId}@foodiegen.com`, fullName: 'Test Component', passwordHash: 'dummy' }
      });
      await prisma.videoProject.create({
        data: { id: projectId, userId: projectId, title: 'Auto-Generated Test Project', status: 'draft' }
      });
    }

    // 3. Save to Database
    const script = await prisma.videoScript.create({
      data: {
        projectId,
        content: scenes,
        version: 1,
        isActive: true,
      },
    });

    return NextResponse.json({ scriptId: script.id, scenes });
  } catch (error: any) {
    console.error('API Error:', error);
    const raw = String(error?.message || error);
    let msg = raw;
    try {
      const m = raw.match(/\{"error":\{[^}]*"message":"([^"]+)"/);
      if (m) msg = m[1];
    } catch {}
    const is404 = raw.includes('404') || raw.toLowerCase().includes('not found');
    const is429 = raw.includes('429') || raw.toLowerCase().includes('quota') || raw.toLowerCase().includes('rate');
    if (is404) {
      return NextResponse.json({
        error: 'Model không tìm thấy. Kiểm tra API key và billing tại Google AI Studio.',
      }, { status: 503 });
    }
    if (is429) {
      return NextResponse.json({
        error: 'Vượt giới hạn quota. Thử lại sau ít phút.',
      }, { status: 429 });
    }
    return NextResponse.json({ error: msg || 'Lỗi tạo nội dung' }, { status: 500 });
  }
}
