
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface User {
    id: number;
    username: string;
    role: string;
    is_active: boolean;
}

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-slate-800">User Management</h1>
        <button (click)="openCreateModal()" class="btn btn-primary">+ Add User</button>
      </div>

      <div class="card overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Username</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let user of users()" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-sm text-slate-500">#{{ user.id }}</td>
              <td class="px-6 py-4 font-medium text-slate-900">{{ user.username }}</td>
              <td class="px-6 py-4">
                <span [class]="getRoleBadgeClass(user.role)" class="px-2 py-1 rounded text-xs font-medium">
                  {{ user.role | uppercase }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span [class]="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button (click)="resetPassword(user)" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Reset Pwd</button>
                <button (click)="editUser(user)" class="text-slate-600 hover:text-slate-800 text-sm font-medium">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-2xl p-6 w-96">
            <h3 class="text-lg font-bold mb-4">{{ isEditing ? 'Edit User' : 'Create User' }}</h3>
            
            <div class="space-y-4">
                <div>
                    <label class="form-label">Username</label>
                    <input [(ngModel)]="formData.username" [disabled]="isEditing" class="input-field" placeholder="Username" />
                </div>
                
                <div *ngIf="!isEditing">
                    <label class="form-label">Password</label>
                    <input [(ngModel)]="formData.password" type="password" class="input-field" placeholder="Password" />
                </div>

                <div>
                    <label class="form-label">Role</label>
                    <select [(ngModel)]="formData.role" class="input-field">
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>

                <div *ngIf="isEditing" class="flex items-center gap-2 mt-2">
                    <input type="checkbox" [(ngModel)]="formData.is_active" id="isActive" class="w-4 h-4 text-blue-600 rounded">
                    <label for="isActive" class="text-sm text-slate-700">Account Active</label>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <button class="btn btn-ghost" (click)="showModal = false">Cancel</button>
                <button class="btn btn-primary" (click)="saveUser()">{{ isEditing ? 'Update' : 'Create' }}</button>
            </div>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
    users = signal<User[]>([]);
    showModal = false;
    isEditing = false;
    formData: any = { username: '', password: '', role: 'viewer', is_active: true };

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.http.get<User[]>('/api/users').subscribe(data => this.users.set(data));
    }

    getRoleBadgeClass(role: string): string {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'editor': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    }

    openCreateModal() {
        this.isEditing = false;
        this.formData = { username: '', password: '', role: 'viewer', is_active: true };
        this.showModal = true;
    }

    editUser(user: User) {
        this.isEditing = true;
        this.formData = { ...user };
        this.showModal = true;
    }

    saveUser() {
        if (this.isEditing) {
            this.http.put(`/api/users/${this.formData.id}`, {
                role: this.formData.role,
                is_active: this.formData.is_active
            }).subscribe(() => {
                this.showModal = false;
                this.loadUsers();
            });
        } else {
            this.http.post('/api/users', this.formData).subscribe({
                next: () => {
                    this.showModal = false;
                    this.loadUsers();
                },
                error: (e) => alert(e.error?.error || 'Error creating user')
            });
        }
    }

    resetPassword(user: User) {
        const newPass = prompt(`Enter new password for ${user.username}:`);
        if (!newPass) return;

        this.http.put(`/api/users/${user.id}/password`, { password: newPass }).subscribe(() => {
            alert('Password updated successfully');
        });
    }
}
