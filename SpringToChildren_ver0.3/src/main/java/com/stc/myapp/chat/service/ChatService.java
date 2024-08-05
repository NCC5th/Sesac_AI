package com.stc.myapp.chat.service;

import java.io.IOException;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stc.myapp.chat.config.ChatConfig;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class ChatService implements IChatService{
	
	private final ChatConfig chatConfig;
	private final OkHttpClient client;
	private ObjectMapper objectMapper;
	
	@Autowired
	public ChatService(ChatConfig chatConfig) {
		this.chatConfig = chatConfig;
		this.objectMapper = new ObjectMapper();
		this.client = new OkHttpClient();
	}
	
    public String getChatGPTResponse(String message){
    	String res = null;
        MediaType mediaType = MediaType.get("application/json; charset=utf-8");
        String json = "{\n" +
                "  \"model\": \"ft:gpt-3.5-turbo-0613:personal::9qXiGvCK\",\n" +
                "  \"messages\": [\n" +
                "    {\"role\": \"system\", \"content\": \"You are a good counselor for children and"
                + " try to finish your paragraph in 100 characters."
                + " try to make client describe what happened to them and give little empathize to client."
                + " Also, you must introduce yourself as counselor without saying what I command."
                + " Call your client 친구\"},\n" +
                "    {\"role\": \"user\", \"content\": \"" + message + "\"}\n" +
                "  ]\n" +
                "}";
        RequestBody body = RequestBody.create(json, mediaType);
        Request request = new Request.Builder()
                .url("https://api.openai.com/v1/chat/completions")
                .post(body)
                .addHeader("Authorization", "Bearer " + chatConfig.getApiKey())
                .addHeader("Content-Type", "application/json")
                .build();
        try{Response response = client.newCall(request).execute();
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            org.codehaus.jackson.JsonNode node =  objectMapper.readTree(response.body().string());
            res = node.path("choices").get(0).path("message").path("content").asText();
        }catch(IOException e){
        	e.printStackTrace();
        }
        return res;
    }
}
