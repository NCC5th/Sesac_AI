package com.stc.myapp.chat.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.stc.myapp.chart.model.ChartVO;
import com.stc.myapp.chart.model.YearVO;
import com.stc.myapp.chart.service.IChartService;
import com.stc.myapp.chat.service.IClovaXService;
import com.stc.myapp.dashboard.model.MapVO;
import com.stc.myapp.dashboard.service.IDashboardService;
import com.stc.myapp.emotion.service.IEmotionService;

@Controller
public class ChatController {
	
	private IDashboardService dashboardService;
	private final IChartService chartService;
	private final IClovaXService clovaXService;
	private final IEmotionService emotionService;
	
	@Autowired
	public ChatController(
			IChartService chartService
			,IEmotionService emotionService, 
			IClovaXService clovaXService,
			IDashboardService dashboardService) {
		this.clovaXService = clovaXService;
		this.chartService = chartService;
		this.emotionService = emotionService;
		this.dashboardService = dashboardService;
	}
	@ResponseBody
	@RequestMapping(value = "/chat", method = RequestMethod.POST, produces = "application/json;charset=UTF-8")
	public String chat(@RequestParam("message") String message) throws Exception {
		try {
			String botResponse = clovaXService.getClovaXResponse(message);
			return botResponse;
		} catch(Exception e) {
			e.printStackTrace();
			return "에러발생: " + e.getMessage();
		}
	}
//================차트================
	@ResponseBody
	@GetMapping("/district")
	public List<String> getGu() {
		return chartService.getArea1();
	}
	
	@ResponseBody
    @GetMapping("/dong")
    public List<String> getDong(@RequestParam("district") String district) {
        return chartService.getArea2(district);
    }
	
	@ResponseBody
	@RequestMapping(value = "/chart", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
    public ChartVO getChart(@RequestParam("district") String district, @RequestParam("dong") String dong) {
        ChartVO result = chartService.getChart(district, dong);
		return result;
        
    }

	//구별 해당 연도 값들 가져오기
	@ResponseBody
	@GetMapping("/data")
	public List<YearVO> getMinMax(@RequestParam("district")String district, @RequestParam("year")String year) {
		List<YearVO> list = chartService.getChartDong(district, year);
		return list;
	}

//=================감정분석 =====================
	@ResponseBody
	@GetMapping("/emotion")
	public String getEmotion(Model model) {
		List<String> list = emotionService.getAllConversation();
		String result = emotionService.getEmotionAnalyze(list);
		System.out.println("컨트롤러에서 JSON을 String으로 반환" +result);
		return result;
	}
	
	@ResponseBody
	@PostMapping("/addConversation")
	public void addConversation(
			@RequestParam("message")String message) {
		int result = emotionService.addConversation(message);
		if(result==1) {
			System.out.println("사용자 대화내역 저장");
			System.out.println(message);
		} else {
		System.out.println("대화내역 저장 에러");
		}
	}
	
//==================페이지 이동 ===============	
	// serviceA로 이동
	@GetMapping("/serviceA")
	public String serviceAPage(Model model) {
		return "/serviceA";
	}
	
	// service페이지로 이동 = 소개 페이지
	@GetMapping("/service")
	public String servicePage(Model model) {
		return "/service";
	}
	
	// main 페이지로 이동
	@GetMapping("/main")
	public String mainPage(Model model) {
		return "/main";
	}


//=====================차트===================

// 새로운 매핑 추가
@GetMapping("/dashboard")
public String dashboard() {
    return "dashboard";
}

@GetMapping("/api/mapData")
@ResponseBody
public List<MapVO> getMapData(@RequestParam String area1, @RequestParam String area2) {
    return dashboardService.getMapData(area1, area2);
}
@GetMapping("/api/initialData")
@ResponseBody
public ResponseEntity<Map<String, Object>> getInitialData() {
    Map<String, Object> data = new HashMap<>();
    data.put("districts", chartService.getArea1());
    data.put("dongs", chartService.getArea2(chartService.getArea1().get(0)));
    data.put("years", dashboardService.getYears());
    return ResponseEntity.ok(data);
}

@GetMapping("/api/chartData")
@ResponseBody
public ResponseEntity<Map<String, Object>> getChartData(
        @RequestParam String district,
        @RequestParam String dong,
        @RequestParam int year) {
    Map<String, Object> data = new HashMap<>();
    ChartVO chartData = chartService.getChart(district, dong);
    List<YearVO> yearData = chartService.getChartDong(district, String.valueOf(year));
    
    data.put("yearData", chartData);
    data.put("regionData", yearData);
    return ResponseEntity.ok(data);
}

@GetMapping("/api/seoulDistricts")
@ResponseBody
public ResponseEntity<List<MapVO>> getSeoulDistricts() {
    List<MapVO> seoulDistricts = dashboardService.getSeoulDistricts();
    return ResponseEntity.ok(seoulDistricts);
}
}