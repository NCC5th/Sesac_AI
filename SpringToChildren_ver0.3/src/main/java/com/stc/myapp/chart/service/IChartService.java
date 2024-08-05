package com.stc.myapp.chart.service;

import java.util.List;

import com.stc.myapp.chart.model.ChartVO;
import com.stc.myapp.chart.model.YearVO;

public interface IChartService {
	List<String> getArea1();
	List<String> getArea2(String area1);
	ChartVO getChart(String area1, String area2);
	List<YearVO> getChartDong(String area1, String year);
}
