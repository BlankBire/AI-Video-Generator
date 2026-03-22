import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import RunwayML from '@runwayml/sdk';

export async function POST(req: Request) {
  try {
    const { scriptId, generationId: inputGenerationId, config } = await req.json();

    if (!scriptId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Initialize RunwayML SDK
    const apiKey = process.env.RUNWAYML_API_KEY;
    if (!apiKey) {
      throw new Error('RUNWAYML_API_KEY is not set');
    }

    const runway = new RunwayML({ apiKey });

    // 2. Fetch script
    const script = await prisma.videoScript.findUnique({ where: { id: scriptId } });
    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    // 3. Handle Video Generation record
    let generationId = inputGenerationId;
    if (!generationId) {
      const newGen = await prisma.videoGeneration.create({
        data: {
          projectId: script.projectId,
          scriptId: script.id,
          generationNo: 1,
          resolution: config?.resolution || '720p',
          aspectRatio: config?.aspectRatio || '9:16',
          status: 'processing',
        }
      });
      generationId = newGen.id;
    }

    const allScenes = script.content as any[];
    const scenes = allScenes.slice(0, 2); // Max 2 scenes for testing
    const results = [];

    // Text-to-video valid models per Runway docs: gen4.5, veo3.1, veo3.1_fast, veo3
    const RUNWAY_MODELS = ['veo3.1_fast', 'veo3.1', 'gen4.5', 'veo3'];
    const ratio = config?.aspectRatio === '16:9' ? '1280:720' : '720:1280';
    const duration = 5; // 2-10 seconds per Runway API

    for (const scene of scenes) {
      const visualPrompt = `${scene.visualDescription}. Style: ${config?.style || 'cinematic'}.`;
      let videoUrl = '';
      let success = false;
      let fallbackModelIdx = 0;

      while (!success && fallbackModelIdx < RUNWAY_MODELS.length) {
        const currentModel = RUNWAY_MODELS[fallbackModelIdx];
        try {
          console.log(`[RUNWAY] Attempting Scene ${scene.sceneOrder} with Model: ${currentModel}`);
          
          const createResponse = await (runway.textToVideo as any).create({
            model: currentModel,
            promptText: visualPrompt.slice(0, 1000), // API max 1000 chars
            ratio,
            duration,
          });

          const taskId = createResponse.id;
          let task = await runway.tasks.retrieve(taskId);

          // Polling
          console.log(`[RUNWAY] Task ID: ${taskId}. Polling...`);
          while (task.status !== 'SUCCEEDED' && task.status !== 'FAILED' && task.status !== 'CANCELLED') {
            await new Promise(r => setTimeout(r, 10000));
            task = await runway.tasks.retrieve(taskId);
            console.log(`[RUNWAY] Task ${taskId} status: ${task.status} (${(task as any).progress || 0}%)`);
          }

          if (task.status === 'SUCCEEDED') {
            videoUrl = (task as any).output?.[0] || '';
            success = true;
            console.log(`[RUNWAY] Scene ${scene.sceneOrder} SUCCESS with ${currentModel}`);
          } else {
             throw new Error(`Task failed with status: ${task.status}`);
          }
        } catch (err: any) {
          const msg = String(err?.message || err);
          console.warn(`[RUNWAY] Model ${currentModel} failed: ${msg}`);
          const tryNext = msg.includes('403') || msg.includes('400') || msg.includes('not available') || msg.includes('Invalid') || msg.includes('not supported');
          if (tryNext && fallbackModelIdx < RUNWAY_MODELS.length - 1) {
            fallbackModelIdx++;
            console.log(`[RUNWAY] Trying next model: ${RUNWAY_MODELS[fallbackModelIdx]}`);
          } else {
            throw err;
          }
        }
      }

      if (!success) {
        throw new Error('All RunwayML models failed or are restricted for this account');
      }

      const dbScene = await prisma.videoScene.create({
        data: {
          generationId,
          sceneOrder: scene.sceneOrder,
          visualPrompt: visualPrompt,
          audioScript: scene.audioScript,
          videoClipUrl: videoUrl,
        },
      });
      results.push(dbScene);
    }

    // 5. Update Status
    await prisma.videoGeneration.update({
      where: { id: generationId },
      data: { status: 'completed' },
    });

    return NextResponse.json({ success: true, generationId, results });
  } catch (error: any) {
    console.error('RunwayML API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
