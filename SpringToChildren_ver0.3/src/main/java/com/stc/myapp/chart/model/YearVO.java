package com.stc.myapp.chart.model;

import org.springframework.stereotype.Repository;

import lombok.Data;

@Repository
@Data
public class YearVO {
	private String area1;
	private String area2;
	private int year;
}
