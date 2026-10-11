package com.ramu.jobapplicationtracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ramu.jobapplicationtracker.model.Company;
import com.ramu.jobapplicationtracker.service.CompanyService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;


    @PostMapping
    public Company createCompany(
            @RequestBody Company company) {

        return companyService.createCompany(company);
    }


    @GetMapping
    public List<Company> getAllCompanies() {

        return companyService.getAllCompanies();
    }


    @GetMapping("/{id}")
    public Company getCompanyById(
            @PathVariable int id) {

        return companyService.getCompanyById(id);
    }


    @PutMapping("/{id}")
    public Company updateCompany(
            @PathVariable int id,
            @RequestBody Company company) {

        return companyService.updateCompany(id, company);
    }


    @DeleteMapping("/{id}")
    public String deleteCompany(
            @PathVariable int id) {

        companyService.deleteCompany(id);

        return "Company deleted successfully";
    }
}
//POST   http://localhost:4571/companies
//GET    http://localhost:4571/companies
//GET    http://localhost:4571/companies/{id}
//PUT    http://localhost:4571/companies/{id}
//DELETE http://localhost:4571/companies/{id}

