package com.stc.myapp.chart.dao;

import java.util.List;

import com.stc.myapp.chart.model.ChartVO;
import com.stc.myapp.chart.model.YearVO;

public interface IChartDAO {

	ChartVO getChart(String area1, String area2);
	List<YearVO> getChartDong(String area1, String year);
	List<String> getArea1();
	List<String> getArea2(String area1);
}
