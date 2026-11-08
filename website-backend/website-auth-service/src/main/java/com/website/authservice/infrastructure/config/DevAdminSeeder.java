package com.website.authservice.infrastructure.config;

import com.website.authservice.domain.entity.AdminUser;
import com.website.authservice.domain.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile("!test")
public class DevAdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DevAdminSeeder.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public DevAdminSeeder(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (adminUserRepository.findByUsernameIgnoreCase("admin").isPresent()) {
            return;
        }
        AdminUser admin = new AdminUser();
        admin.setId(UUID.randomUUID());
        admin.setUsername("admin");
        admin.setDisplayName("KRAN Admin");
        admin.setPasswordHash(passwordEncoder.encode(System.getenv().getOrDefault("WEBSITE_DEV_ADMIN_PASSWORD", "Admin@123")));
        admin.setActive(true);
        adminUserRepository.save(admin);
        log.info("Seeded default CMS admin user 'admin' (override password via WEBSITE_DEV_ADMIN_PASSWORD)");
    }
}
