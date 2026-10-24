package com.graphrag.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/business")
@CrossOrigin(origins = "*") 
public class QueryController {

    private final String PYTHON_AI_SERVICE_URL = "http://localhost:8001/api/v1/ask"; 

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "business-gateway");
        status.put("port", 8080);
        status.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/query")
    public ResponseEntity<Map<String, String>> processQuery(@RequestBody Map<String, String> request) {
        String userQuery = request.get("query");
        
        System.out.println("Received business request for: " + userQuery);
        
        RestTemplate restTemplate = new RestTemplate();
        Map<String, String> aiRequest = new HashMap<>();
        aiRequest.put("query", userQuery);
        
        try {
            Map aiResponse = restTemplate.postForObject(PYTHON_AI_SERVICE_URL, aiRequest, Map.class);
            Map<String, String> finalResponse = new HashMap<>();
            finalResponse.put("response", (String) aiResponse.get("answer"));
            return ResponseEntity.ok(finalResponse);
        } catch (Exception e) {
             Map<String, String> error = new HashMap<>();
             error.put("response", "Error contacting AI Service: " + e.getMessage());
             return ResponseEntity.internalServerError().body(error);
        }
    }
}