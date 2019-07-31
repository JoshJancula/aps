import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})

export class PhonePipe implements PipeTransform {
  transform(phone) {
    if (!phone) { return null; }
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length !== 10) { return phone; }
    const char = { 0: '(', 3: ') ', 6: '-' };
    let formattedPhone = '';
    for (let i = 0; i < numbers.length; i++) {
      formattedPhone += (char[i] || '') + numbers[i];
    }
    return formattedPhone;
  }
}
