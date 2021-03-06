import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('bindKey')
  async getBindKey(): Promise<string> {
    return this.appService.getBindKey();
  }

  @Get('playLists')
  async getPlaylists() {
    return this.appService.getPlaylists();
  }

  @Get('createTestPlaylist')
  async createTestPlaylist() {
    return this.appService.createTestPlaylist();
  }

  @Get('slides')
  async getSlides() {
    return this.appService.getSlides();
  }

  @Get('createTestSlide')
  async createTestSlide() {
    return this.appService.createTestSlide();
  }

  @Get('templates')
  async getTemplates() {
    return this.appService.getTemplates();
  }

  @Get('createSlideInPlaylist')
  async createSlideInPlaylist() {
    return this.appService.createSlideInPlaylist();
  }

  @Get('adminToken')
  async getAdminToken(): Promise<object> {
    return this.appService.getAdminToken();
  }
}
