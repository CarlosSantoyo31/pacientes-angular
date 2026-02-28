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

@Injectable({
  providedIn: 'root',
})
export class PacientesService {
  private pacientesCollection;

  constructor(private firestore: Firestore) {
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
    return addDoc(this.pacientesCollection, paciente);
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
