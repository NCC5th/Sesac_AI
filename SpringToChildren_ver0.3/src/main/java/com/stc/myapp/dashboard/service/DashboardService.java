package com.stc.myapp.dashboard.service;

import com.stc.myapp.dashboard.dao.IDashboardDAO;
import com.stc.myapp.dashboard.model.MapVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService implements IDashboardService {

    @Autowired
    private IDashboardDAO dashboardDAO;

    @Override
    public List<MapVO> getMapData(String area1, String area2) {
        return dashboardDAO.getMapData(area1, area2);
    }

    @Override
    public List<Integer> getYears() {
        return dashboardDAO.getYears();
    }

    @Override
    public List<MapVO> getSeoulDistricts() {
        return dashboardDAO.getSeoulDistricts();
    }
}