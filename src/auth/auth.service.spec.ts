import { UsuariosService } from "src/usuarios/usuarios.service";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from 'bcryptjs';
import { Test, TestingModule } from "@nestjs/testing";

describe('AuthService - login()', () => {
  let service: AuthService;
  let usuariosServiceMock: Partial<UsuariosService>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    const password = '123456';
    const hashedPassword = await bcryptjs.hash(password, 10); // 💡 Hashear la contraseña

    usuariosServiceMock = {
      findByEmailWithPassword: jest.fn().mockResolvedValue({
        id: 1,
        username: 'admin',
        email: 'admin@mail.com',
        password: hashedPassword, // ✔ Aquí ponemos el hash
        rol: 'ADMIN',
      }),
    };

    jwtServiceMock = {
      signAsync: jest.fn().mockResolvedValue('fake-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuariosService, useValue: usuariosServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('debería retornar access y refresh tokens si las credenciales son correctas', async () => {
    const result = await service.login('admin@mail.com', '123456');
    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
    expect(result.access_token).toBe('fake-token');
  });
});
