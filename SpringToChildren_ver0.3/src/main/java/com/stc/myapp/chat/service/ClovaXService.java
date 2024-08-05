package com.stc.myapp.chat.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stc.myapp.chat.config.ClovaXConfig;

import okhttp3.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClovaXService implements IClovaXService{

	private ClovaXConfig clovaXConfig;
    private OkHttpClient client;
    private ObjectMapper objectMapper;

    @Autowired
    public ClovaXService(ClovaXConfig clovaXConfig) {
    	this.clovaXConfig = clovaXConfig;
        this.objectMapper = new ObjectMapper();
        this.client = new OkHttpClient().newBuilder()
                .connectTimeout(10, TimeUnit.SECONDS)  // 연결 시간 제한
                .writeTimeout(10, TimeUnit.SECONDS)     // 쓰기 시간 제한
                .readTimeout(10, TimeUnit.SECONDS)      // 읽기 시간 제한
                .build();
    }

    public String getClovaXResponse(String message) {
        StringBuilder result = new StringBuilder();
        MediaType mediaType = MediaType.get("application/json; charset=utf-8");

        // JSON 요청 본문 생성
        String json = "{\n" +
        	    "  \"messages\": [\n" +
        	    "    {\n" +
        	    "      \"role\": \"system\",\n" +
        	    "      \"content\": \"되도록이면 100글자이내로 말해줘\\n대화하듯이 짧게 주고받는게 중요해\\n너의 역할은 청소년,아동 심리상담가야\"\n" +
        	    "    },\n" +
        	    "    {\n" +
        	    "      \"role\": \"user\",\n" +
        	    "      \"content\": \"" + message + "\"\n" +
        	    "    }\n" +
        	    "  ],\n" +
        	    "  \"topP\": 0.8,\n" +
        	    "  \"topK\": 128,\n" +
        	    "  \"maxTokens\": 256,\n" +
        	    "  \"temperature\": 0.5,\n" +
        	    "  \"repeatPenalty\": 5.0,\n" +
        	    "  \"stopBefore\": [],\n" +
        	    "  \"includeAiFilters\": true,\n" +
        	    "  \"seed\": 0\n" +
        	    "}";

        RequestBody body = RequestBody.create(json, mediaType);
        Request request = new Request.Builder()
            .url("https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003")
            .post(body)
            .addHeader("X-NCP-CLOVASTUDIO-API-KEY", clovaXConfig.getApiKey())
            .addHeader("X-NCP-APIGW-API-KEY", clovaXConfig.getApiGateWayKey())
            .addHeader("X-NCP-CLOVASTUDIO-REQUEST-ID", clovaXConfig.getRequestID())
            .addHeader("Content-Type", "application/json")
            .addHeader("Accept", "text/event-stream")
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);

            // 스트림 데이터 읽기
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(response.body().byteStream()))) {
                String line;
                StringBuilder contentBuilder = new StringBuilder();
                boolean isFinal = false;

                while ((line = reader.readLine()) != null) {
                    System.out.println("stream받음");

                    if (line.startsWith("data:")) {
                        String jsonString = line.substring(5).trim();
                        
                        // JSON 문자열 파싱
                        JsonNode node = objectMapper.readTree(jsonString);
                        if (node.has("message")) {
                            JsonNode messageNode = node.get("message");
                            if (messageNode.has("role") && messageNode.get("role").asText().equals("assistant")) {
                                String content = messageNode.path("content").asText();
                                if (!content.isEmpty()) {
                                    contentBuilder.append(content);
                                }
                            }
                        }
                    } else if (line.startsWith("event:") && line.contains("result")) {
                        isFinal = true;
                    }
                    
                    // 데이터 전송 완료 처리
                    if (isFinal) {
                        break;
                    }
                }

                result.append(contentBuilder.toString().trim()); // 최종 결과 문자열 반환
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result.toString();
    }
}