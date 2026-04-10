'use client';

function FieldCard({ label, value }) {
  return (
    <div style={{
      padding: '12px 14px',
      borderRadius: 8,
      border: '1px solid var(--border-light)',
      backgroundColor: 'var(--cream-card)',
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--brown-soft)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: value ? 'var(--brown)' : 'var(--brown-light)',
        fontWeight: value ? 500 : 400,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {value || 'Not specified'}
      </div>
    </div>
  );
}

export default function HiringBriefView({ hiringBrief }) {
  if (!hiringBrief) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: 40,
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--brown-soft)', marginBottom: 8,
          }}>
            No hiring brief yet
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 11,
            color: 'var(--brown-light)',
          }}>
            Continue the conversation to populate the hiring brief
          </p>
        </div>
      </div>
    );
  }

  var skills = hiringBrief.skills || [];
  var responsibilities = hiringBrief.responsibilities || [];

  return (
    <div style={{
      padding: '24px 28px 40px',
      overflowY: 'auto',
      height: '100%',
    }}>
      {/* Role Overview */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          color: 'var(--brown)', marginBottom: 12,
        }}>
          Role Overview
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <FieldCard label="Title" value={hiringBrief.title} />
          <FieldCard label="Department" value={hiringBrief.department} />
          <FieldCard label="Experience" value={hiringBrief.experience} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <FieldCard label="Work Mode" value={hiringBrief.workMode} />
          <FieldCard label="Location" value={hiringBrief.location} />
          <FieldCard label="Salary Range" value={hiringBrief.salary} />
        </div>
      </div>

      {/* Must-Have Skills */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          color: 'var(--brown)', marginBottom: 12,
        }}>
          Must-Have Skills
        </div>
        {skills.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map(function (skill, i) {
              return (
                <span key={i} style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  backgroundColor: 'rgba(139,105,20,0.06)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--brown)',
                }}>
                  {skill}
                </span>
              );
            })}
          </div>
        ) : (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'var(--brown-light)', fontStyle: 'italic',
          }}>
            No skills specified yet
          </p>
        )}
      </div>

      {/* Key Responsibilities */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
          color: 'var(--brown)', marginBottom: 12,
        }}>
          Key Responsibilities
        </div>
        {responsibilities.length > 0 ? (
          <ul style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--brown)', lineHeight: 1.7,
            paddingLeft: 20, margin: 0,
          }}>
            {responsibilities.map(function (resp, i) {
              var clean = resp.replace(/^(will|should|responsible for)\s+/i, '').trim();
              clean = clean.charAt(0).toUpperCase() + clean.slice(1);
              return <li key={i} style={{ marginBottom: 4 }}>{clean}</li>;
            })}
          </ul>
        ) : (
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'var(--brown-light)', fontStyle: 'italic',
          }}>
            No responsibilities specified yet
          </p>
        )}
      </div>

      {/* Company */}
      {(hiringBrief.companyName || hiringBrief.companyIndustry) && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
            color: 'var(--brown)', marginBottom: 12,
          }}>
            Company
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {hiringBrief.companyName && (
              <FieldCard label="Name" value={hiringBrief.companyName} />
            )}
            {hiringBrief.companyIndustry && (
              <FieldCard label="Industry" value={hiringBrief.companyIndustry} />
            )}
          </div>
        </div>
      )}

      {/* Matched Role */}
      {hiringBrief.matchedRoleName && hiringBrief.matchScore > 0 && (
        <div style={{
          padding: '12px 14px',
          borderRadius: 8,
          border: '1px solid rgba(39,130,91,0.15)',
          backgroundColor: 'rgba(39,130,91,0.04)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: 'var(--accent-green)', textTransform: 'uppercase',
            letterSpacing: '0.06em', marginBottom: 4,
          }}>
            Matched Role
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: 13,
            color: 'var(--accent-green)', fontWeight: 500,
          }}>
            {hiringBrief.matchedRoleName}
          </div>
        </div>
      )}
    </div>
  );
}
