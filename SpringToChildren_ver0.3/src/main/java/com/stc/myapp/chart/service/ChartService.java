package com.stc.myapp.chart.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stc.myapp.chart.dao.IChartDAO;
import com.stc.myapp.chart.model.ChartVO;
import com.stc.myapp.chart.model.YearVO;

@Service
public class ChartService implements IChartService{
	
	@Autowired
	IChartDAO chartDAO;
	
	public List<String> getArea1(){
		return chartDAO.getArea1();
	}
	
	public List<String> getArea2(String area1){
		return chartDAO.getArea2(area1);
	}
	
	public ChartVO getChart(String area1, String area2) {
		return chartDAO.getChart(area1, area2);
	}
	
	public List<YearVO> getChartDong(String area1, String year) {
		return chartDAO.getChartDong(area1, year);
	}
}
