package com.ramu.jobapplicationtracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ramu.jobapplicationtracker.model.Interview;
import com.ramu.jobapplicationtracker.service.InterviewService;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;


    @PostMapping
    public Interview createInterview(
            @RequestBody Interview interview) {

        return interviewService.createInterview(interview);
    }


    @GetMapping
    public List<Interview> getAllInterviews() {

        return interviewService.getAllInterviews();
    }


    @GetMapping("/{id}")
    public Interview getInterviewById(
            @PathVariable int id) {

        return interviewService.getInterviewById(id);
    }


    @PutMapping("/{id}")
    public Interview updateInterview(
            @PathVariable int id,
            @RequestBody Interview interview) {

        return interviewService.updateInterview(
                id, interview);
    }


    @DeleteMapping("/{id}")
    public String deleteInterview(
            @PathVariable int id) {

        interviewService.deleteInterview(id);

        return "Interview deleted successfully";
    }
}
//POST   http://localhost:4571/interviews
//GET    http://localhost:4571/interviews
//GET    http://localhost:4571/interviews/{id}
//PUT    http://localhost:4571/interviews/{id}
//DELETE http://localhost:4571/interviews/{id}

