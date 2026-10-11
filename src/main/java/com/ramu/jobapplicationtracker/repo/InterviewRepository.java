package com.ramu.jobapplicationtracker.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ramu.jobapplicationtracker.model.Interview;

public interface InterviewRepository
        extends JpaRepository<Interview, Integer> {

}
