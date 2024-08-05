package com.stc.myapp.chart.dao;

import java.sql.ResultSet;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.stc.myapp.chart.model.ChartVO;
import com.stc.myapp.chart.model.YearVO;

@Repository
public class ChartDAO implements IChartDAO{

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	private class ChartMapper implements RowMapper<ChartVO>{
		@Override
		public ChartVO mapRow(ResultSet rs, int count) throws SQLException{
			ChartVO chart = new ChartVO();
	        chart.setArea1(rs.getString("AREA1"));
	        chart.setArea2(rs.getString("AREA2"));
	        chart.setYear_2012(rs.getInt("YEAR_2012"));
	        chart.setYear_2013(rs.getInt("YEAR_2013"));
	        chart.setYear_2014(rs.getInt("YEAR_2014"));
	        chart.setYear_2015(rs.getInt("YEAR_2015"));
	        chart.setYear_2016(rs.getInt("YEAR_2016"));
	        chart.setYear_2017(rs.getInt("YEAR_2017"));
	        chart.setYear_2018(rs.getInt("YEAR_2018"));
	        chart.setYear_2019(rs.getInt("YEAR_2019"));
	        chart.setYear_2020(rs.getInt("YEAR_2020"));
	        chart.setYear_2021(rs.getInt("YEAR_2021"));
	        chart.setYear_2022(rs.getInt("YEAR_2022"));
	        chart.setYear_2023(rs.getInt("YEAR_2023"));
	        chart.setYear_2024(rs.getInt("YEAR_2024"));
	        chart.setYear_2025(rs.getInt("YEAR_2025"));
	        chart.setYear_2026(rs.getInt("YEAR_2026"));
	        chart.setYear_2027(rs.getInt("YEAR_2027"));
	        return chart;
		}
	}
	
	// 차트 시각화용 데이터
	public ChartVO getChart(String area1, String area2){
		String sql = "SELECT AREA1, AREA2, YEAR_2012,"
				+ " YEAR_2013, YEAR_2014, YEAR_2015, YEAR_2016,"
				+ " YEAR_2017, YEAR_2018, YEAR_2019, YEAR_2020,"
				+ " YEAR_2021, YEAR_2022, YEAR_2023, YEAR_2024,"
				+ " YEAR_2025, YEAR_2026, YEAR_2027 FROM LOWINCOME WHERE AREA1 = ? AND AREA2 = ?";
		ChartVO result = jdbcTemplate.queryForObject(sql, new ChartMapper(), area1, area2);
	    return result;
	}
	
	//차트 시각화용 데이터 리스트
	public List<YearVO> getChartDong(String area1, String year){
		String sql = "SELECT AREA1, AREA2, YEAR_"+year+
							" FROM LOWINCOME WHERE AREA1 = ?";
		return jdbcTemplate.query(sql, new RowMapper<YearVO>(){
			@Override
			public YearVO mapRow(ResultSet rs, int count) throws SQLException{
				YearVO yearVO = new YearVO();
				yearVO.setArea1(rs.getString("AREA1"));
				yearVO.setArea2(rs.getString("AREA2"));
		        switch (year) {
	            case "2012": yearVO.setYear(rs.getInt("YEAR_2012")); break;
	            case "2013": yearVO.setYear(rs.getInt("YEAR_2013")); break;
	            case "2014": yearVO.setYear(rs.getInt("YEAR_2014")); break;
	            case "2015": yearVO.setYear(rs.getInt("YEAR_2015")); break;
	            case "2016": yearVO.setYear(rs.getInt("YEAR_2016")); break;
	            case "2017": yearVO.setYear(rs.getInt("YEAR_2017")); break;
	            case "2018": yearVO.setYear(rs.getInt("YEAR_2018")); break;
	            case "2019": yearVO.setYear(rs.getInt("YEAR_2019")); break;
	            case "2020": yearVO.setYear(rs.getInt("YEAR_2020")); break;
	            case "2021": yearVO.setYear(rs.getInt("YEAR_2021")); break;
	            case "2022": yearVO.setYear(rs.getInt("YEAR_2022")); break;
	            case "2023": yearVO.setYear(rs.getInt("YEAR_2023")); break;
	            case "2024": yearVO.setYear(rs.getInt("YEAR_2024")); break;
	            case "2025": yearVO.setYear(rs.getInt("YEAR_2025")); break;
	            case "2026": yearVO.setYear(rs.getInt("YEAR_2026")); break;
	            case "2027": yearVO.setYear(rs.getInt("YEAR_2027")); break;
		        }
		        return yearVO;
			}
		}, area1);
	}
	
	// 선택지용 구별
	public List<String> getArea1(){
		String sql ="SELECT DISTINCT AREA1 FROM LOWINCOME";
		return jdbcTemplate.queryForList(sql, String.class);
	}
	
	// 선택지용 동별
	public List<String> getArea2(String area1){
		String sql ="SELECT DISTINCT AREA2 FROM LOWINCOME WHERE AREA1 = ?";
		return jdbcTemplate.queryForList(sql, String.class, area1);
	}
}

