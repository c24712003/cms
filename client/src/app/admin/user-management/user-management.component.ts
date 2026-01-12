
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
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold text-slate-800">User Management</h1>
        <button (click)="openCreateModal()" class="btn btn-primary w-full md:w-auto flex justify-center items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Add User
        </button>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Username</th>
              <th class="px-6 py-4">Role</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr *ngFor="let user of users()" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-xs font-mono text-slate-400">#{{ user.id }}</td>
              <td class="px-6 py-4 font-bold text-slate-700">{{ user.username }}</td>
              <td class="px-6 py-4">
                <span [class]="getRoleBadgeClass(user.role)" class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wide">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span [class.bg-green-100]="user.is_active" [class.text-green-700]="user.is_active" 
                      [class.bg-red-100]="!user.is_active" [class.text-red-700]="!user.is_active"
                      class="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full" [class.bg-green-500]="user.is_active" [class.bg-red-500]="!user.is_active"></span>
                  {{ user.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button (click)="resetPassword(user)" class="text-slate-400 hover:text-blue-600 font-medium text-xs transition-colors" title="Reset Password">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636a1.003 1.003 0 00-.454-.242l-2.646-.882a6 6 0 00-7.072 6.641l1.635-1.19a4 4 0 005.656 0L15 7z"/></svg>
                </button>
                <button (click)="editUser(user)" class="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors bg-blue-50 px-3 py-1 rounded-md">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="md:hidden space-y-4">
        <div *ngFor="let user of users()" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                        {{ user.username.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                        <h3 class="font-bold text-slate-800">{{ user.username }}</h3>
                        <span class="text-xs text-slate-400">ID: #{{ user.id }}</span>
                    </div>
                </div>
                <span [class]="getRoleBadgeClass(user.role)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                  {{ user.role }}
                </span>
            </div>
            
            <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                 <span [class.text-green-600]="user.is_active" [class.text-red-500]="!user.is_active" class="text-xs font-bold flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full" [class.bg-green-500]="user.is_active" [class.bg-red-500]="!user.is_active"></span>
                    {{ user.is_active ? 'Active' : 'Inactive' }}
                 </span>
                 
                 <div class="flex items-center gap-2">
                     <button (click)="resetPassword(user)" class="btn btn-xs btn-ghost text-slate-400" title="Reset Password">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.636a1.003 1.003 0 00-.454-.242l-2.646-.882a6 6 0 00-7.072 6.641l1.635-1.19a4 4 0 005.656 0L15 7z"/></svg>
                     </button>
                     <button (click)="editUser(user)" class="btn btn-xs btn-outline btn-primary">Edit</button>
                 </div>
            </div>
        </div>
      </div>

      <!-- Create/Edit Modal (Responsive) -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
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

                <div *ngIf="isEditing" class="flex items-center gap-2 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <input type="checkbox" [(ngModel)]="formData.is_active" id="isActive" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500">
                    <label for="isActive" class="text-sm font-medium text-slate-700">Account Active</label>
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
