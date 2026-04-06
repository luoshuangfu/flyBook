package com.timeline.todo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "time_block")
public class TimeBlock {
  @Id
  @GeneratedValue
  private UUID id;

  @ManyToOne(optional = true)
  @JoinColumn(name = "task_id", nullable = true)
  private Task task;

  @Column(nullable = false)
  private Instant startTime;

  private Instant endTime;

  @Column(nullable = false)
  private Integer durationMinutes;

  private String category;

  private String tags;

  @Enumerated(EnumType.STRING)
  private TimeBlockSource source;

  @Enumerated(EnumType.STRING)
  private TimeBlockNature nature;

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public Task getTask() {
    return task;
  }

  public void setTask(Task task) {
    this.task = task;
  }

  public Instant getStartTime() {
    return startTime;
  }

  public void setStartTime(Instant startTime) {
    this.startTime = startTime;
  }

  public Instant getEndTime() {
    return endTime;
  }

  public void setEndTime(Instant endTime) {
    this.endTime = endTime;
  }

  public Integer getDurationMinutes() {
    return durationMinutes;
  }

  public void setDurationMinutes(Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getTags() {
    return tags;
  }

  public void setTags(String tags) {
    this.tags = tags;
  }

  public TimeBlockSource getSource() {
    return source;
  }

  public void setSource(TimeBlockSource source) {
    this.source = source;
  }

  public TimeBlockNature getNature() {
    return nature;
  }

  public void setNature(TimeBlockNature nature) {
    this.nature = nature;
  }
}

