import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) {}
months = [
  "January", 
  "February", 
  "March", 
  "April", 
  "May", 
  "June", 
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
];
async create(user, createReportDto: CreateReportDto) {
  const date = new Date();

  // Use Intl.DateTimeFormat for formatting the date and time
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',  // This will give you the full month name
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false   // This makes sure the time is in 24-hour format
  }).format(date);

  const newReport = await this.reportRepository.create({
    ...createReportDto,
    date: formattedDate,
  });

  newReport.user = user?.id;
  await this.reportRepository.save(newReport);

  return {
    success: true,
    message: "Report created Successfully",
    report: newReport,
  };
}


  findAll() {
    return this.reportRepository.find({relations: ['user']})
  }

  findOne(id: number) {
    return this.reportRepository.findOne({where: {id}, relations: ['user']})
  }

}
