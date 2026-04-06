package com.timeline.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TimelineTodoApplication {
  public static void main(String[] args) {
    SpringApplication.run(TimelineTodoApplication.class, args);
  }
}
