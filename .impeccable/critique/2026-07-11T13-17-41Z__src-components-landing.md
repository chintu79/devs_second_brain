---
target: landing page
total_score: 24
p0_count: 1
p1_count: 2
p2_count: 2
p3_count: 0
timestamp: 2026-07-11T13-17-41Z
slug: src-components-landing
---
**Method: dual-agent (A: design-review · B: detector-scan)**

## Design Health Score

| # | Heuristic | Score | Change | Key Issue |
|---|-----------|-------|--------|-----------|
| 1 | Visibility of System Status | 3 | — | Search shows live count. Same-animation entropy across sections |
| 2 | Match System / Real World | 3 | +1 | Tools scatter works. "Knowledge OS" still vague |
| 3 | User Control and Freedom | 2 | -1 | KnowledgeTile buttons are decorative — functional trap |
| 4 | Consistency and Standards | 2 | — | #6366F1 vs #5B6CFF still competing. Duplicate copy in ProblemSection |
| 5 | Error Prevention | 3 | +1 | Search empty state. Fake buttons erode trust |
| 6 | Recognition Rather Than Recall | 2 | -1 | 7 identical sections blur together |
| 7 | Flexibility and Efficiency | 2 | +1 | Skip-to-content works. No keyboard shortcuts |
| 8 | Aesthetic and Minimalist Design | 2 | -1 | 3 animation systems competing; motion is decorative |
| 9 | Error Recovery | 2 | +1 | Search clear, reader close. No destructive actions |
| 10 | Help and Documentation | 3 | +2 | Docs link, trust copy in CTA, self-explanatory flow |
| **Total** | | **24/40** | **+3** | **Acceptable — improving** |

## Anti-Patterns Verdict

**AI slop**: Reduced but not eliminated. The 7-section template uniformity is the remaining tell. Search tab is now genuinely functional which helps.

**Detector**: 14 font-size violations remain (down from 19). All are 10px/11px in hero mockup and knowledge tiles — intentional mockup scaling, not design drift.

## Bigger Concerns Unchanged
- R3F canvas: 150-300KB bundle cost for a purely decorative effect. Every mobile visitor pays.
- 7 sections: identical structure causes scroll fatigue after section 3
- Accent bleed: `#6366F1` vs `#5B6CFF` still competing in 5 places

## Priority Issues

- **[P0] KnowledgeTile buttons do nothing**: BookOpen, ExternalLink, Heart have aria-labels, hover states, opacity transitions — but zero onClick. Users who click them get dead clicks. Remove or wire them.
- **[P1] Duplicate copy in ProblemSection**: "But context lives nowhere." appears at line 57 AND line 91 in the same section. Delete the redundant pivot line.
- **[P1] Accent color still bleeds**: DESIGN.md normalized to #6366F1 but 5 references to #5B6CFF remain (hero headline, progress dots, search focus ring, CSS --accent var, particle color). Migrate all to #6366F1.
- **[P2] R3F canvas**: 150-300KB bundle + GPU cost for a decorative background. Replace with CSS gradient or remove.
- **[P2] 7 sections**: Merge/delete to reduce to 4-5. WhySection duplicates Features. SolutionFlow restates the hero demo.
