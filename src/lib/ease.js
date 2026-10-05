import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// GSAP twin of $ease-cinematic — cubic-bezier(0.83, 0, 0.17, 1).
export const EASE_CINEMATIC = CustomEase.create('cinematic', '0.83,0,0.17,1');
