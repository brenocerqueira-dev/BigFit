import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  showPassword = false;
  isScrolled: boolean = false;


  depoimentos = [
    {
      nome: 'Afonso Evangelista',
      texto: 'O sistema de treinos inteligentes da BIGFIT mudou completamente a minha rotina. O acompanhamento de evolução é sensacional!',
      meta: 'Hipertrofia'
    },
    {
      nome: 'Caio Lima',
      texto: 'Interface linda e super intuitiva! O cálculo automatizado de IMC e metas me mantêm focado todos os dias na academia.',
      meta: 'Emagrecimento'
    },
    {
      nome: 'Camille Victoria',
      texto: 'Treinos diretos ao ponto e eficientes. Consigo conciliar perfeitamente com a minha rotina pesada de trabalho e estudos.',
      meta: 'Condicionamento'
    }
  ];

  indexAtivo = 0;
  intervaloCarrossel: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private el: ElementRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      lgpd: [false, Validators.requiredTrue]
    });
  }


  ngOnInit() {
    this.iniciarAutoplay();
  }

  ngOnDestroy() {
    this.pararAutoplay();
  }


  iniciarAutoplay() {
    this.intervaloCarrossel = setInterval(() => {

      this.indexAtivo = (this.indexAtivo + 1) % this.depoimentos.length;
    }, 7000);
  }

  pararAutoplay() {
    if (this.intervaloCarrossel) {
      clearInterval(this.intervaloCarrossel);
    }
  }

  reiniciarAutoplay() {
    this.pararAutoplay();
    this.iniciarAutoplay();
  }


  proximo() {
    this.indexAtivo = (this.indexAtivo + 1) % this.depoimentos.length;
    this.reiniciarAutoplay();
  }

  anterior() {
    this.indexAtivo = (this.indexAtivo - 1 + this.depoimentos.length) % this.depoimentos.length;
    this.reiniciarAutoplay();
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('esconder-antes-do-scroll');
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    const hiddenElements = this.el.nativeElement.querySelectorAll('.esconder-antes-do-scroll');
    hiddenElements.forEach((el: any) => observer.observe(el));
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, senha } = this.loginForm.value;

    this.authService.login(email, senha).subscribe({
      next: (user) => {
        this.isLoading = false;
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/student/meu-treino']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'E-mail ou senha inválidos. Tente novamente.';
      }
    });
  }
}