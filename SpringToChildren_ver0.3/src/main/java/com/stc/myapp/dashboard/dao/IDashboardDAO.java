package com.stc.myapp.dashboard.dao;

import com.stc.myapp.dashboard.model.MapVO;
import java.util.List;

public interface IDashboardDAO {
    List<MapVO> getMapData(String area1, String area2);
    List<Integer> getYears();
    List<MapVO> getSeoulDistricts();
}
