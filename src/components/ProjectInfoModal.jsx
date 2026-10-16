import React from 'react';
import { X, Award, Users, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { PROJECT_INFO } from '../data/sampleData';

export default function ProjectInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Award className="modal-header-icon" size={24} />
            <div>
              <h3>Academic Project Information</h3>
              <p className="modal-subtitle">{PROJECT_INFO.title}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Metadata Cards */}
          <div className="modal-meta-grid">
            <div className="meta-card">
              <span className="meta-label">Domain</span>
              <strong className="meta-val">{PROJECT_INFO.academicDomain}</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">Industry Focus</span>
              <strong className="meta-val">{PROJECT_INFO.industryFocus}</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">Core Focus</span>
              <strong className="meta-val">Measures of Central Tendency</strong>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="modal-section">
            <div className="section-title-row">
              <Users size={18} className="text-primary" />
              <h4>Project Team Members</h4>
            </div>
            <div className="team-grid">
              {PROJECT_INFO.teamMembers.map((member, idx) => (
                <div key={idx} className="team-member-card">
                  <div className="member-avatar">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="member-details">
                    <span className="member-name">{member.name}</span>
                    <span className="member-reg">{member.regNo}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Objectives */}
          <div className="modal-section">
            <div className="section-title-row">
              <BookOpen size={18} className="text-primary" />
              <h4>Academic Objectives & Core Statistics</h4>
            </div>
            <ul className="objectives-list">
              <li>
                <CheckCircle size={15} className="bullet-icon text-success" />
                <span><strong>Arithmetic Mean (x̄ = Σ X / N):</strong> Quantify the parametric center of CPU, RAM, and Latency under empirical loads.</span>
              </li>
              <li>
                <CheckCircle size={15} className="bullet-icon text-success" />
                <span><strong>Median (50th Percentile):</strong> Establish the robust center, insensitive to extreme latency outliers or CPU burst spikes.</span>
              </li>
              <li>
                <CheckCircle size={15} className="bullet-icon text-success" />
                <span><strong>Mode (Maximum Frequency):</strong> Identify the most recurrent state or operating modality of the system.</span>
              </li>
              <li>
                <CheckCircle size={15} className="bullet-icon text-success" />
                <span><strong>Comparative Analysis:</strong> Evaluate skewness (Mean vs Median) to deduce system stability and workload consistency.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
