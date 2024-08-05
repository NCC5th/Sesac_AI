package com.stc.myapp.emotion.service;

import java.io.IOException;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Repository;

import com.stc.myapp.chat.config.EmotionConfig;
import com.stc.myapp.emotion.model.EmotionVO;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Repository
public class EmotionService implements IEmotionService{
	
	private EmotionVO emotionVO;
	private  EmotionConfig emotionConfig;
	private  OkHttpClient client;
	private ObjectMapper objectMapper;
	
	public EmotionService(EmotionConfig emotionConfig) {
		this.emotionConfig = emotionConfig;
		this.objectMapper = new ObjectMapper();
		this.client = new OkHttpClient();
		this.emotionVO = new EmotionVO();
	}
	
	
	public int addConversation(String conversation) {
		int result = emotionVO.addConversation(conversation);
		return result;
	}
	
	public String getConversation(int index) {
		List<String> list = emotionVO.getConversation();
		return list.get(index);
	}
	
	public List<String> getAllConversation() {
		return emotionVO.getConversation();
	}
	
	public String getEmotionAnalyze(List<String> list) {
		
			String res = null;
	        StringBuilder sb = new StringBuilder();
	        for (String s : list) {
	            sb.append(s);
	        }
	        String result = sb.toString();
	        System.out.println("대화내용 생성완료");
	        MediaType mediaType = MediaType.get("application/json; charset=utf-8");
	        String json = "{\n" +
	                "  \"model\": \"gpt-4-turbo\",\n" +
	                "  \"messages\": [\n" +
	                "    {\"role\": \"system\", \"content\": \"Must keep template I give and return as json, analyze emotion from message I give "
	                + "template : anger = 0~100 happiness = 0~100 sadness = 0~100 neutral = 0~100 fear = 0~100 surprise = 0~100 confuse = 0~100\"},\n" +
	                "    {\"role\": \"user\", \"content\": \"" + result + "\"}\n" +
	                "  ]\n" +
	                "}";
	        RequestBody body = RequestBody.create(json, mediaType);
	        Request request = new Request.Builder()
	                .url("https://api.openai.com/v1/chat/completions")
	                .post(body)
	                .addHeader("Authorization", "Bearer " + emotionConfig.getApiKey())
	                .addHeader("Content-Type", "application/json")
	                .build();
	        try{Response response = client.newCall(request).execute();
	            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
	            org.codehaus.jackson.JsonNode node =  objectMapper.readTree(response.body().string());
	            res = node.path("choices").get(0).path("message").path("content").asText();
	        }catch(IOException e){
	        	e.printStackTrace();
	        }
	        System.out.println("응답생성 완료 감정 값 반환");
	        return res;
	}
}
