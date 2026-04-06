'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useAppStore } from '@/stores/app-store';
import { ROLE_CREATION_QUESTIONS, AI_ACKS, matchRole } from '@/lib/constants';
import SearchPage from '@/components/role-creation/search-page';
import ChatPanel from '@/components/role-creation/chat-panel';
import JDCanvas from '@/components/role-creation/jd-canvas';

var STAGES = [
  { key: 'describe', label: 'Describe' },
  { key: 'refine', label: 'Refine' },
  { key: 'jd-ready', label: 'JD Ready' },
];

function inferDepartment(answers) {
  var text = ((answers.title || '') + ' ' + (answers.own || '')).toLowerCase();
  if (text.includes('research') || text.includes('scientist')) return 'Research';
  if (text.includes('platform') || text.includes('infrastructure') || text.includes('devops')) return 'Infrastructure';
  if (text.includes('product') || text.includes('manager')) return 'Product';
  if (text.includes('data')) return 'Data';
  if (text.includes('nlp') || text.includes('language')) return 'NLP';
  return 'Engineering';
}

function generateJD(answers, matched, company) {
  var title = answers.title || (matched ? matched.title : 'Open Role');
  var oneLiner = matched ? matched.oneLiner : '';
  var companyName = company?.name || 'Our Company';
  var companyDesc = company?.description || 'We are a forward-thinking technology company building cutting-edge AI solutions.';

  var ownership = answers.own || 'core AI/ML initiatives';
  var skills = answers.skills || 'Strong technical background';
  var level = answers.level || 'Relevant experience level';
  var extras = answers.extra || 'Competitive compensation';

  var lines = ['# ' + title];
  if (oneLiner) lines.push('', oneLiner);

  lines.push(
    '',
    '## About ' + companyName,
    companyDesc,
    '',
    '## Responsibilities',
    '- Lead ' + ownership,
    '- Collaborate cross-functionally with engineering and product teams',
    '- Drive technical direction in ' + (answers.skills || 'relevant domain'),
    '',
    '## Requirements',
    '- ' + skills,
    '- ' + level,
    '- Experience with modern AI/ML tools and frameworks',
    '',
    '## Details',
    '- ' + extras
  );

  return lines.join('\n');
}

function ProgressIndicator({ currentStage }) {
  return (
    <div style={{
      display: 'flex',
      gap: 6,
      padding: '14px 32px 10px',
      borderBottom: '1px solid var(--border-default)',
      marginBottom: 0,
    }}>
      {STAGES.map(function (stage, i) {
        var isCurrent = i === currentStage;
        var isDone = i < currentStage;

        var barColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--gold)' : 'var(--border-default)';
        var labelColor = isDone ? 'var(--accent-green)' : isCurrent ? 'var(--gold)' : 'var(--border-default)';

        return (
          <div key={stage.key} style={{ flex: 1 }}>
            <div style={{ height: 3, borderRadius: 2, backgroundColor: barColor, transition: 'background-color 0.2s ease' }} />
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              marginTop: 5,
              textAlign: 'center',
              color: labelColor,
              userSelect: 'none',
            }}>{stage.label}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function RoleCreatePage() {
  var router = useRouter();
  var addRole = useAppStore(function (s) { return s.addRole; });
  var company = useAppStore(function (s) { return s.company; });

  var [stage, setStage] = useState(0);
  var [messages, setMessages] = useState([]);
  var [questionIndex, setQuestionIndex] = useState(0);
  var [isTyping, setIsTyping] = useState(false);
  var [answers, setAnswers] = useState({});
  var [jdContent, setJDContent] = useState('');
  var [jdPortalTarget, setJDPortalTarget] = useState(null);
  var [description, setDescription] = useState('');
  var [matchedRole, setMatchedRole] = useState(null);
  var [matchScore, setMatchScore] = useState(0);
  var [sharableLink] = useState(function () {
    return 'https://assess.jack-co.com/jd/' + Math.random().toString(36).slice(2, 10);
  });

  // Watch for the portal target element
  useEffect(function () {
    if (stage < 2) return;
    var check = function () {
      var el = document.getElementById('jd-canvas-panel');
      if (el) setJDPortalTarget(el);
    };
    check();
    var timer = setInterval(check, 100);
    return function () { clearInterval(timer); };
  }, [stage]);

  // Toggle right panel visibility via custom event
  useEffect(function () {
    if (stage >= 2) {
      window.dispatchEvent(
        new CustomEvent('jd-panel-toggle', { detail: { visible: true } })
      );
    }
    return function () {
      window.dispatchEvent(
        new CustomEvent('jd-panel-toggle', { detail: { visible: false } })
      );
    };
  }, [stage]);

  // Perform role matching
  var doMatch = useCallback(function (text) {
    var result = matchRole(text);
    setMatchedRole(result.role);
    setMatchScore(result.score);
    return result;
  }, []);

  var addAIMessage = useCallback(function (content) {
    setIsTyping(true);
    var delay = 700 + Math.random() * 500;
    setTimeout(function () {
      setMessages(function (prev) { return prev.concat([{ role: 'ai', content: content }]); });
      setIsTyping(false);
    }, delay);
  }, []);

  // Handle initial search submit
  function handleSearchSubmit(text) {
    setDescription(text);
    setStage(1);
    // Match role from initial input
    doMatch(text);
    // Add the user's description as first message, then AI asks Q1
    setMessages([{ role: 'user', content: text }]);
    addAIMessage(
      'Great, I\'ll help you build this role. ' + ROLE_CREATION_QUESTIONS[0].question
    );
  }

  // Handle chat message send
  function handleChatSend(text) {
    var currentQ = ROLE_CREATION_QUESTIONS[questionIndex];
    var newAnswers = Object.assign({}, answers, { [currentQ.id]: text });
    setAnswers(newAnswers);

    // Add user message
    setMessages(function (prev) { return prev.concat([{ role: 'user', content: text }]); });

    // Re-match role with all answers combined
    var allText = description + ' ' + Object.values(newAnswers).join(' ');
    var matchResult = doMatch(allText);

    var nextIndex = questionIndex + 1;

    // After 3rd question answered, show JD panel
    if (nextIndex >= 3 && stage < 2) {
      setStage(2);
      var jd = generateJD(newAnswers, matchResult.role, company);
      setJDContent(jd);
    }

    setQuestionIndex(nextIndex);

    if (nextIndex < ROLE_CREATION_QUESTIONS.length) {
      // Update JD if we're already in split view
      if (nextIndex >= 3) {
        var updatedJD = generateJD(newAnswers, matchResult.role, company);
        setJDContent(updatedJD);
      }

      // Pick a random acknowledgment + next question
      var ack = AI_ACKS[Math.floor(Math.random() * AI_ACKS.length)];
      addAIMessage(ack + ' ' + ROLE_CREATION_QUESTIONS[nextIndex].question);
    } else {
      // All questions answered
      var finalJD = generateJD(newAnswers, matchResult.role, company);
      setJDContent(finalJD);
      addAIMessage(
        'Your JD is ready! Feel free to edit it on the right. Click Save Role when you\'re done.'
      );
    }
  }

  // Handle JD save
  function handleSaveRole() {
    if (!jdContent.trim()) return;

    var title = answers.title || (matchedRole ? matchedRole.title : description.slice(0, 40));
    addRole({
      title: title,
      dept: inferDepartment(answers),
      salary: answers.extra || 'TBD',
      status: 'active',
      roleRef: matchedRole,
      jd: jdContent,
      sharableLink: sharableLink,
    });
    router.push(
      '/roles/create/complete?title=' + encodeURIComponent(title)
    );
  }

  var currentQuestion = ROLE_CREATION_QUESTIONS[questionIndex] || null;
  var allQuestionsAnswered = questionIndex >= ROLE_CREATION_QUESTIONS.length;
  var isCompact = stage >= 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '-32px -32px -64px -32px', height: '100vh' }}>
      <ProgressIndicator currentStage={stage} />

      <div style={{ flex: 1, overflow: 'hidden' }}>
        {stage === 0 && <SearchPage onSubmit={handleSearchSubmit} />}

        {stage >= 1 && (
          <div className="h-full flex justify-center">
            <div className="h-full w-full" style={{ maxWidth: isCompact ? undefined : 660 }}>
              <ChatPanel
                messages={messages}
                onSend={handleChatSend}
                currentQuestion={allQuestionsAnswered ? null : currentQuestion}
                isTyping={isTyping}
                compact={isCompact}
              />
            </div>
          </div>
        )}
      </div>

      {/* JD Canvas rendered into the layout's right panel via portal */}
      {stage >= 2 &&
        jdPortalTarget &&
        createPortal(
          <div className="h-full p-4">
            <JDCanvas
              content={jdContent}
              onChange={setJDContent}
              onSave={allQuestionsAnswered ? handleSaveRole : undefined}
              matchedRoleName={matchedRole ? matchedRole.title : null}
              matchScore={matchScore}
              sharableLink={sharableLink}
            />
          </div>,
          jdPortalTarget
        )}
    </div>
  );
}
