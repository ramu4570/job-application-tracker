package com.ramu.jobapplicationtracker.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ramu.jobapplicationtracker.model.JobApplication;
import com.ramu.jobapplicationtracker.service.JobApplicationService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/applications")
public class JobApplicationController {

    @Autowired
    private JobApplicationService service;

    @PostMapping
    public JobApplication createApplication(
            @RequestBody JobApplication application) {

        return service.createApplication(application);
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {

        return service.getAllApplications();
    }
    @GetMapping("/user/{userName}")
    public List<JobApplication> getApplicationsByUserName(
            @PathVariable String userName) {

        return service.getApplicationsByUserName(userName);
    }

    @GetMapping("/{id}")
    public JobApplication getApplicationById(
            @PathVariable int id) {

        return service.getApplicationById(id);
    }

    @PutMapping("/{id}")
    public JobApplication updateApplication(
            @PathVariable int id,
            @RequestBody JobApplication application) {

        return service.updateApplication(id, application);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(
            @PathVariable int id) {

        service.deleteApplication(id);

        return "Application deleted successfully";
    }
}
//POST   http://localhost:4571/applications
//GET    http://localhost:4571/applications
//GET    http://localhost:4571/applications/user/Ramu
//GET    http://localhost:4571/applications/{id}
//PUT    http://localhost:4571/applications/{id}
//DELETE http://localhost:4571/applications/{id}
