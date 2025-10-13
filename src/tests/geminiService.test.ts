import { describe, it, expect, vi } from 'vitest';
import { generatePitch } from '@/services/geminiService';
import { GoogleGenAI } from '@google/genai';

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  const mockGoogleGenAI = {
    models: {
      generateContent: mockGenerateContent,
    },
  };
  return {
    GoogleGenAI: vi.fn(() => mockGoogleGenAI),
    Type: {
      STRING: 'string',
      ARRAY: 'array',
    }
  };
});

describe('geminiService', () => {
  it('should return a pitch when the API call is successful', async () => {
    const mockGenerateContent = vi.fn().mockResolvedValue({
      text: JSON.stringify(['answer1', 'answer2']),
    });

    const ai = new GoogleGenAI({ apiKey: 'test-key' });
    (ai.models.generateContent as any) = mockGenerateContent;

    const pitch = await generatePitch('test description');

    expect(pitch).toEqual(['answer1', 'answer2']);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when the API call fails', async () => {
    const mockGenerateContent = vi.fn().mockRejectedValue(new Error('API Error'));

    const ai = new GoogleGenAI({ apiKey: 'test-key' });
    (ai.models.generateContent as any) = mockGenerateContent;

    await expect(generatePitch('test description')).rejects.toThrow('Failed to generate pitch from AI. The model may be unavailable or the request was invalid.');
  });
});