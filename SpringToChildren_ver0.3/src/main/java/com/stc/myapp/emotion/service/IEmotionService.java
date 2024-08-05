package com.stc.myapp.emotion.service;

import java.util.List;

public interface IEmotionService {

	int addConversation(String conversation);
	String getConversation(int index);
	List<String> getAllConversation();
	 String getEmotionAnalyze(List<String> list);
}
