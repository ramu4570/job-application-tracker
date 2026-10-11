package com.ramu.jobapplicationtracker.serviceimpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ramu.jobapplicationtracker.model.Interview;
import com.ramu.jobapplicationtracker.repo.InterviewRepository;
import com.ramu.jobapplicationtracker.service.InterviewService;

@Service
public class InterviewServiceImpl implements InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;


    @Override
    public Interview createInterview(Interview interview) {

        return interviewRepository.save(interview);
    }


    @Override
    public List<Interview> getAllInterviews() {

        return interviewRepository.findAll();
    }


    @Override
    public Interview getInterviewById(int id) {

        return interviewRepository.findById(id).orElse(null);
    }


    @Override
    public Interview updateInterview(
            int id,
            Interview interview) {

        Interview oldInterview =
                interviewRepository.findById(id).orElse(null);

        if (oldInterview != null) {

            oldInterview.setApplicationId(
                    interview.getApplicationId());

            oldInterview.setRoundName(
                    interview.getRoundName());

            oldInterview.setInterviewDate(
                    interview.getInterviewDate());

            oldInterview.setInterviewType(
                    interview.getInterviewType());

            oldInterview.setInterviewer(
                    interview.getInterviewer());

            oldInterview.setStatus(
                    interview.getStatus());

            oldInterview.setFeedback(
                    interview.getFeedback());

            return interviewRepository.save(oldInterview);
        }

        return null;
    }


    @Override
    public void deleteInterview(int id) {

        interviewRepository.deleteById(id);
    }
}


