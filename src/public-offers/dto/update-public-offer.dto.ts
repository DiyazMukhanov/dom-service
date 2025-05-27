import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicOfferDto } from './create-public-offer.dto';

export class UpdatePublicOfferDto extends PartialType(CreatePublicOfferDto) {}
