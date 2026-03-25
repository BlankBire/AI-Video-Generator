import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('[V8-DEBUG] CONTENT REQUEST BODY:', { ...body, productImage: body.productImage ? 'BASE64_STUB' : 'null' });
    
    const { topic, tone, projectId, characterType, locationContext, numScenes, productImage } = body;

    if (!topic || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Initialize New GenAI SDK (Google AI Studio Mode)
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_API_KEY is not set in environment variables');
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelId = 'gemini-flash-latest'; 

    let promptParts: any[] = [];
    
    const sceneCountStr = String(numScenes || '2 cảnh');
    const sceneCount = parseInt(sceneCountStr.replace(/[^0-9]/g, '')) || 2;

    const basePrompt = `Bạn là một biên kịch TikTok chuyên nghiệp chuyên về mảng ẩm thực.
Hãy tạo kịch bản video ngắn cho món: ${topic}.
Tone nội dung: ${tone}.
Nhân vật chính: ${characterType || 'Người bán hàng'} (Nếu là Nữ: hãy mô tả là cô gái xinh tươi, giọng ngọt ngào; Nếu là Nam: hãy mô tả là anh chàng dễ thương, hiền lành, lịch sự).
Bối cảnh diễn ra: ${locationContext || 'Trong cửa hàng'}.

Yêu cầu kịch bản:
- Trả về một mảng JSON (Array) gồm đúng ${sceneCount} đối tượng cảnh quay.
- Mỗi đối tượng có:
    - sceneOrder: số thứ tự.
    - title: tên ngắn gọn của cảnh.
    - visualDescription: mô tả hình ảnh cực kỳ chi tiết bằng TIẾNG ANH để AI tạo video (như RunwayML) hiểu tốt nhất. Hãy đưa chi tiết bối cảnh và ngoại hình nhân vật vào đây.
    - audioScript: lời thoại hoặc âm thanh nền bằng TIẾNG VIỆT, phù hợp với tính cách nhân vật đã chọn.

Chỉ trả về chuỗi JSON thô, không kèm markdown, không kèm giải thích.`;

    if (productImage && productImage.includes('base64,')) {
      const parts = productImage.split('base64,');
      const base64Data = parts[1];
      const mimeType = productImage.split(';')[0].split(':')[1];
      
      promptParts = [
        { text: basePrompt + `\n\nLƯU Ý ĐẶC BIỆT: Người dùng đã tải lên hình ảnh sản phẩm mẫu. 
1. Đầu tiên, hãy kiểm tra xem hình ảnh đó có phải là đồ ăn hoặc liên quan đến ẩm thực không. Nếu KHÔNG PHẢI đồ ăn, hãy thêm một thuộc tính "warning": "Ảnh không phải đồ ăn" vào JSON trả về, nhưng vẫn cố gắng tạo kịch bản dựa trên tên món ăn: ${topic}.
2. Nếu LÀ ĐỒ ĂN, hãy mô tả hình ảnh trong visualDescription sao cho bám sát các đặc điểm (màu sắc, hình dáng, cách bày trí) của ảnh mẫu đó.` },
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ];
    } else {
      promptParts = [{ text: basePrompt }];
    }

    console.log(`[V8-API-KEY] Calling Model: ${modelId} with Multimodal: ${!!productImage}`);

    // 2. Generate Content
    let result: any;
    try {
        result = await ai.models.generateContent({
          model: modelId,
          contents: [{ role: 'user', parts: promptParts }],
        });
    } catch (aiErr: any) {
        console.error('[V8-DEBUG] AI GENERATION FAILED:', aiErr);
        
        // --- GRACEFUL FALLBACK ---
        if (aiErr.message?.includes('Unable to process input image') || aiErr.message?.includes('400')) {
          console.warn('[V8-DEBUG] AI rejected image. Falling back to text-only generation.');
          // Retry without image
          try {
            result = await ai.models.generateContent({
              model: modelId,
              contents: [{ role: 'user', parts: [{ text: basePrompt }] }],
            });
            // Mock a warning into the response text manually if needed, 
            // but we'll handle it better by just setting the warning variable later.
            result.__forced_warning = "AI Studio không thể xử lý ảnh này (có thể do vi phạm chính sách hoặc lỗi định dạng). Đã tạo kịch bản dựa trên văn bản.";
          } catch (retryErr: any) {
            throw new Error(`AI Retry Error: ${retryErr.message}`);
          }
        } else {
          throw new Error(`AI Studio Error: ${aiErr.message || 'Unknown AI error'}`);
        }
    }

    const candidate = result.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const contentText = part?.text || '';
    console.log('[V8-DEBUG] RAW GENAI RESPONSE:', contentText);

    if (!contentText) {
        throw new Error('AI trả về kết quả rỗng. Vui lòng thử lại.');
    }

    const jsonString = contentText.replace(/```json/g, '').replace(/```/g, '').trim();
    let scenes = [];
    let warning = null;
    
    try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
          scenes = parsed;
        } else if (parsed.scenes) {
          scenes = parsed.scenes;
          warning = parsed.warning;
        } else if (parsed.warning && Array.isArray(parsed.data)) {
           scenes = parsed.data;
           warning = parsed.warning;
        } else {
          scenes = [parsed];
        }
    } catch (parseError) {
        console.log('[V8-DEBUG] JSON Parse failed, trying regex extraction...');
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

    // 2. Ensure Project Exists
    console.log('[V8-DEBUG] Verifying Project:', projectId);
    const existingProject = await prisma.videoProject.findUnique({ where: { id: projectId } });
    if (!existingProject) {
      console.log('[V8-DEBUG] Creating dummy user/project for:', projectId);
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
    console.log('[V8-DEBUG] Saving script to DB...');
    const script = await prisma.videoScript.create({
      data: {
        projectId,
        content: scenes,
        version: 1,
        isActive: true,
      },
    });

    console.log('[V8-DEBUG] SUCCESS. Script ID:', script.id);
    return NextResponse.json({ 
      scriptId: script.id, 
      scenes, 
      warning: warning || result.__forced_warning 
    });
  } catch (error: any) {
    console.error('[V8-CRITICAL] API Error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi hệ thống không xác định' }, { status: 500 });
  }
}
