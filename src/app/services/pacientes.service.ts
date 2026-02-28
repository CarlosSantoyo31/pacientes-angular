import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Paciente } from '../models/paciente.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private pacientesCollection;

  constructor(private firestore: Firestore, private auth: AuthService) {
    this.pacientesCollection = collection(this.firestore, 'pacientes');

  }

  getPacientes(): Observable<Paciente[]> {
    return collectionData(this.pacientesCollection, { idField: 'id' }).pipe(
      map((pacientes: any[]) =>
        pacientes.map((paciente) => ({
          ...paciente,
          fechaNacimiento: paciente.fechaNacimiento?.toDate
            ? paciente.fechaNacimiento.toDate()
            : paciente.fechaNacimiento,
        })),
      ),
    );
  }

  addPaciente(paciente: Paciente): Promise<any> {
  const ownerId = this.auth.uid;
  if (!ownerId) throw new Error('Usuario no autenticado');

  const dataConOwner: Paciente = {
    ...paciente,
    ownerId, // se agrega automáticamente aquí
  };

  return addDoc(this.pacientesCollection, dataConOwner);
}
  updatePaciente(id: string, paciente: Partial<Paciente>): Promise<void> {
    const pacienteDoc = doc(this.firestore, `pacientes/${id}`);
    return updateDoc(pacienteDoc, paciente);
  }

  deletePaciente(id: string): Promise<void> {
    const pacienteDoc = doc(this.firestore, `pacientes/${id}`);
    return deleteDoc(pacienteDoc);
  }
}
