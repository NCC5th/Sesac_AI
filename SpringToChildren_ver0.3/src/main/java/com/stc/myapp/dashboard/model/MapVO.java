package com.stc.myapp.dashboard.model;

import org.springframework.stereotype.Repository;
import lombok.Data;

@Repository
@Data
public class MapVO {
    private String area1;
    private String area2;
    private double latitude;
    private double longitude;
    private int population;
}