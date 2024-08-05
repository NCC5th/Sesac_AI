package com.stc.myapp.dashboard.dao;

import com.stc.myapp.dashboard.model.MapVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class DashboardDAO implements IDashboardDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private RowMapper<MapVO> mapRowMapper = new RowMapper<MapVO>() {
        @Override
        public MapVO mapRow(ResultSet rs, int rowNum) throws SQLException {
            MapVO map = new MapVO();
            map.setArea1(rs.getString("AREA1"));
            map.setArea2(rs.getString("AREA2"));
            map.setLatitude(rs.getDouble("LATITUDE"));
            map.setLongitude(rs.getDouble("LONGITUDE"));
            map.setPopulation(rs.getInt("POPULATION"));
            return map;
        }
    };

    @Override
    public List<MapVO> getMapData(String area1, String area2) {
        String sql = "SELECT AREA1, AREA2, LATITUDE, LONGITUDE, POPULATION FROM MAP_DATA WHERE AREA1 = ? AND AREA2 = ?";
        return jdbcTemplate.query(sql, mapRowMapper, area1, area2);
    }

    @Override
    public List<Integer> getYears() {
        String sql = "SELECT DISTINCT YEAR FROM LOWINCOME ORDER BY YEAR";
        return jdbcTemplate.queryForList(sql, Integer.class);
    }

    @Override
    public List<MapVO> getSeoulDistricts() {
        String sql = "SELECT DISTINCT AREA1, AREA2, LATITUDE, LONGITUDE, POPULATION FROM MAP_DATA WHERE AREA2 = '전체'";
        return jdbcTemplate.query(sql, mapRowMapper);
    }
}

