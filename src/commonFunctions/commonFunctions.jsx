import NotificationSound2 from "../assets/NotificationSound2.mp3";
import ChatNotificationSound from "../../public/chatRingtone.mp3";
import React, { useState, useEffect } from "react";

function formatIndianPrice(value) {
  let valueChecked = +value || 0;
  const formattedValue = valueChecked.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return formattedValue;
}

function formatUSDPrice(value) {
  let valueChecked = +value || 0;
  const formattedValue = valueChecked.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formattedValue;
}
const NotificationSoundPlay = () => {
  const audio = new Audio(NotificationSound2);
  audio.play();
};
const ChatNotificationPlay = () => {
  const audio = new Audio(ChatNotificationSound);
  audio.play();
};

const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  };
  const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);

  return formattedDate;
};

const formateDateAndTime = (originalDate) => {
  const date = new Date(originalDate);
  const hours = date.getHours();

  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based, so add 1
  const day = date.getDate();

  const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;
  const formattedDate = `${day < 10 ? `0${day}` : day}-${
    month < 10 ? `0${month}` : month
  }-${year}`;

  return `${formattedTime}, ${formattedDate}`;
};

const formatTime = (originalDate) => {
  const date = new Date(originalDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;

  return `${formattedTime}`;
};

const formatDateForWhatsApp = (date) => {
  const today = new Date();
  const messageDate = new Date(date);

  if (
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  } else {
    today.setDate(today.getDate() - 1);
    if (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }
};

function formatsDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateTimeLeft(targetDate) {
  const difference = new Date(targetDate) - new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
}

function truncateFileName(fileName, maxLength) {
  const dotIndex = fileName.lastIndexOf(".");
  if (dotIndex === -1) return fileName; // No extension found

  const name = fileName.slice(0, dotIndex);
  const extension = fileName.slice(dotIndex);

  if (fileName.length <= maxLength) {
    return fileName;
  }

  const charsToShow = maxLength - extension.length - 3; // Adjust for "..." and extension
  if (charsToShow <= 0) {
    return "..." + extension;
  }

  const truncatedName = name.slice(0, charsToShow) + "...";
  return truncatedName + extension;
}

export {
  formatIndianPrice,
  formatUSDPrice,
  NotificationSoundPlay,
  formatDate,
  formateDateAndTime,
  formatsDate,
  formatTime,
  ChatNotificationPlay,
  formatDateForWhatsApp,
  truncateFileName,
};
