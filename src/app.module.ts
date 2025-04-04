import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig } from 'dbConfig';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthorModule,
    BookModule,
    TypeOrmModule.forRoot(postgresConfig),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('EXPIRE_dIdN:', process.env.JWT_EXPIRE_IN);
  }
}
