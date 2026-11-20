package com.website.authservice.web.controller;

import com.website.authservice.application.service.CaptchaService;
import com.website.authservice.web.response.CaptchaResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CaptchaController.class)
@AutoConfigureMockMvc(addFilters = false)
class CaptchaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CaptchaService captchaService;

    @Test
    void getCaptchaReturnsChallenge() throws Exception {
        when(captchaService.createChallenge()).thenReturn(
                new CaptchaResponse("cap-id", "data:image/svg+xml;base64,abc")
        );

        mockMvc.perform(get("/api/v1/captcha/getCaptcha"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.captchaId").value("cap-id"))
                .andExpect(jsonPath("$.imageBase64").value("data:image/svg+xml;base64,abc"));
    }
}