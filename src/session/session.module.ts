import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionEntity } from "./session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
