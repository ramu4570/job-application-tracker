package com.ramu.jobapplicationtracker.service;

import java.util.List;

import com.ramu.jobapplicationtracker.model.Interview;

public interface InterviewService {

    Interview createInterview(Interview interview);

    List<Interview> getAllInterviews();

    Interview getInterviewById(int id);

    Interview updateInterview(int id, Interview interview);

    void deleteInterview(int id);
}


