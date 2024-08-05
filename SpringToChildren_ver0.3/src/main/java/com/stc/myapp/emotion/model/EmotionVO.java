package com.stc.myapp.emotion.model;

import java.util.LinkedList;
import java.util.List;

public class EmotionVO {
	
	private List<String> list;
	
	public EmotionVO() {
		this.list = new LinkedList<String>();
	}
	
	public int addConversation(String conversation) {
		Boolean result = list.add(conversation);
		if(result==true) {
			return 1;
		}
		return 0;
	}
	
	public List<String> getConversation(){
		return list;
	}
}
