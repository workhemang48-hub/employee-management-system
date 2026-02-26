-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2026 at 11:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ems`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `name`) VALUES
(1, 'Engineering'),
(2, 'Finance'),
(3, 'Management'),
(4, 'Marketing');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `designation` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(20) DEFAULT 'employee',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `department_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `department`, `designation`, `phone`, `join_date`, `email`, `password`, `role`, `status`, `created_at`, `department_id`) VALUES
(1, 'Hemang Shrivastav', 'Engineering', 'deva', '00000000000', '2026-01-01', 'hemang@test.com', 'emp@123', 'employee', 'active', '2026-01-26 11:55:05', 1),
(30, 'not ', 'Finance', 'fin', '894169269533', '2024-05-05', 'not@test.com', 'emp@123', 'employee', 'active', '2026-01-27 09:48:22', 2),
(31, 'Admin User', 'Management', 'Administrator', '9999999999', '2024-01-01', 'admin@test.com', 'admin123', 'admin', 'active', '2026-01-29 13:45:52', 3),
(34, 'maya', 'Marketing', 'manager', '8992339999', '2026-01-22', 'maya@test.com', 'emp@123', 'employee', 'active', '2026-02-02 13:27:02', 4),
(35, 'Rahul', 'Marketing', 'sales man', '898989663152', '2026-02-10', 'rahul@test.com', 'emp@123', 'employee', 'active', '2026-02-09 09:42:51', 4),
(36, 'new', 'Management', 'new ', '8946523476', '2026-02-26', 'new@test.com', 'emp@123', 'employee', 'active', '2026-02-26 10:27:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leaves`
--

CREATE TABLE `leaves` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leaves`
--

INSERT INTO `leaves` (`id`, `employee_id`, `leave_type`, `start_date`, `end_date`, `reason`, `status`, `created_at`) VALUES
(6, 1, 'Casual Leave', '2026-02-05', '2026-02-05', 'movie night', 'Rejected', '2026-02-02 10:13:13'),
(7, 1, 'Sick Leave', '2026-02-03', '2026-02-04', 'fever', 'Approved', '2026-02-02 11:04:32'),
(8, 34, 'Emergency Leave', '2026-02-03', '2026-02-03', 'father addmit', 'Approved', '2026-02-02 13:31:53'),
(9, 34, 'Sick Leave', '2026-02-04', '2026-02-04', 'sick', 'Rejected', '2026-02-02 13:42:51'),
(10, 1, 'Casual Leave', '2026-02-11', '2026-02-12', 'personal', 'Approved', '2026-02-03 13:09:01'),
(12, 35, 'Sick Leave', '2026-02-11', '2026-02-11', 'fever', 'Approved', '2026-02-09 10:02:18'),
(13, 36, 'Sick Leave', '2026-02-27', '2026-02-27', 'fever', 'Pending', '2026-02-26 10:34:05');

-- --------------------------------------------------------

--
-- Table structure for table `salaries`
--

CREATE TABLE `salaries` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `basic_salary` decimal(10,2) NOT NULL,
  `ot_hours` int(11) DEFAULT 0,
  `ot_rate` decimal(10,2) DEFAULT 100.00,
  `ot_payment` decimal(10,2) GENERATED ALWAYS AS (`ot_hours` * `ot_rate`) STORED,
  `total_salary` decimal(10,2) GENERATED ALWAYS AS (`basic_salary` + `ot_hours` * `ot_rate`) STORED,
  `status` enum('Pending','Updated') DEFAULT 'Updated',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `salary_month` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salaries`
--

INSERT INTO `salaries` (`id`, `employee_id`, `basic_salary`, `ot_hours`, `ot_rate`, `status`, `created_at`, `updated_at`, `salary_month`) VALUES
(22, 1, 90000.00, 31, 100.00, 'Updated', '2026-01-27 12:55:40', '2026-02-19 14:34:02', '2026-01-01'),
(26, 30, 9999.00, 9, 100.00, 'Updated', '2026-01-27 13:09:48', '2026-02-19 14:34:02', '2026-01-01'),
(30, 34, 50000.00, 10, 100.00, 'Updated', '2026-02-02 13:27:40', '2026-02-19 14:34:30', '2026-02-01'),
(32, 35, 10000.00, 8, 100.00, 'Updated', '2026-02-09 09:43:06', '2026-02-21 11:35:29', '2026-02-01'),
(35, 36, 8000.00, 3, 100.00, '', '2026-02-26 10:28:15', '2026-02-26 10:29:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','employee') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', 'admin123', 'admin'),
(2, 'employee', 'emp123', 'employee'),
(3, 'adim@test.com', '12345', 'employee');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_department` (`department_id`);

--
-- Indexes for table `leaves`
--
ALTER TABLE `leaves`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_employee_leave` (`employee_id`);

--
-- Indexes for table `salaries`
--
ALTER TABLE `salaries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `leaves`
--
ALTER TABLE `leaves`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `salaries`
--
ALTER TABLE `salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `fk_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `leaves`
--
ALTER TABLE `leaves`
  ADD CONSTRAINT `fk_employee_leave` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leaves_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `salaries`
--
ALTER TABLE `salaries`
  ADD CONSTRAINT `salaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
