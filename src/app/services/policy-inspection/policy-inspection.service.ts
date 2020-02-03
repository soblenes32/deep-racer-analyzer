import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PolicyInspectionService {
  public imageArr = [
    {uri: 'assets/images/simulation/sim-image-3-00000.png'},
    {uri: 'assets/images/simulation/sim-image-3-00112.png'},
    {uri: 'assets/images/simulation/sim-image-3-00184.png'},
    {uri: 'assets/images/simulation/sim-image-3-00232.png'},
    {uri: 'assets/images/simulation/sim-image-3-00336.png'},
    {uri: 'assets/images/simulation/sim-image-3-00392.png'},
    {uri: 'assets/images/simulation/sim-image-3-00464.png'},
    {uri: 'assets/images/simulation/sim-image-3-00520.png'},
    {uri: 'assets/images/simulation/sim-image-3-00600.png'},
    {uri: 'assets/images/simulation/sim-image-3-00696.png'},
    {uri: 'assets/images/simulation/sim-image-3-00768.png'},
    {uri: 'assets/images/simulation/sim-image-3-00872.png'},
    {uri: 'assets/images/simulation/sim-image-3-00904.png'}
  ];

  public selectedImage: any = null; // Ref to image uri object
  public selectedModel: any = null; // Ref to S3 model list object

  constructor() { }
}
