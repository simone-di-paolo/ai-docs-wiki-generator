import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'Inter, system-ui, sans-serif',
});


interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);

  const sanitizeMermaid = (str: string): string => {
    if (!str) return str;
    
    // Remove any markdown fences and normalize line endings
    let clean = str.replace(/```mermaid/g, '').replace(/```/g, '').trim();
    clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Ensure diagram header exists
    if (!/^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|pie|journey|gitGraph)/i.test(clean)) {
      clean = `graph TD\n${clean}`;
    }

    const lines = clean.split('\n');
    const sanitizedLines = lines.map(line => {
      let l = line.trim().replace(/;$/, ''); // Remove trailing semicolons
      if (!l || l.startsWith('%%')) return l;

      // Skip header lines unchanged
      if (/^(graph|flowchart|sequenceDiagram|gantt|classDiagram|stateDiagram|erDiagram|pie|journey|gitGraph)/i.test(l)) return l;

      // Strategy: find edge label sections and node label sections separately
      // Step 1: Sanitize edge labels -- Label --> (dashed arrows)
      // Use `[^-\n]*?` to prevent consuming the dashes in `-->`
      l = l.replace(/--([^-\n]*?)-->/g, (match, labelRaw) => {
        const labelTrimmed = labelRaw.trim();
        if (!labelTrimmed) return match; // No label (just -->), leave unchanged
        // Strip existing surrounding quotes, convert inner double quotes to single
        const inner = labelTrimmed.replace(/^"+|"+$/g, '').replace(/"/g, "'");
        if (!inner) return match;
        return `-- "${inner}" -->`;
      });

      // Step 2: Sanitize node labels - ID[Label] style nodes
      // Use a two pass: first find square bracket nodes, then curly bracket nodes
      // Each conversion: strip existing quotes, re-wrap, convert inner doubles to singles
      const sanitizeNodeLabel = (content: string) => {
        return content.trim().replace(/^"+|"+$/g, '').replace(/"/g, "'");
      };

      // Square bracket nodes: A[Label]
      l = l.replace(/\b([a-zA-Z0-9_-]+)\[([^\]]*)\]/g, (_, id, content) =>
        `${id}["${sanitizeNodeLabel(content)}"]`
      );

      // Curly bracket nodes: A{Label}
      l = l.replace(/\b([a-zA-Z0-9_-]+)\{([^}]*)\}/g, (_, id, content) =>
        `${id}{"${sanitizeNodeLabel(content)}"}`
      );

      // Round bracket nodes: A(Label)
      l = l.replace(/\b([a-zA-Z0-9_-]+)\(([^)]*)\)/g, (_, id, content) =>
        `${id}("${sanitizeNodeLabel(content)}")`
      );

      return l;
    });

    return sanitizedLines.join('\n');
  };









  useEffect(() => {
    let isMounted = true;

    if (ref.current && chart) {
      // Ensure we clear previous content
      ref.current.removeAttribute('data-processed');
      ref.current.innerHTML = '';

      const renderDiagram = async () => {
        const sanitizedChart = sanitizeMermaid(chart);
        try {
          // Small delay to prevent queue congestion during category switches
          await new Promise(resolve => setTimeout(resolve, 50));
          
          if (!isMounted) return;

          // Check if valid mermaid syntax before rendering
          const isValid = await mermaid.parse(sanitizedChart);
          if (isValid && isMounted) {
            // ID must start with a letter for Mermaid
            const id = `mermaid-chart-${Math.random().toString(36).substring(2, 11)}`;
            const { svg } = await mermaid.render(id, sanitizedChart);
            if (ref.current && isMounted) {
              ref.current.innerHTML = svg;
            }
          }
        } catch (error) {
          if (!isMounted) return;
          console.error('Mermaid parse error:', error);

          if (ref.current) {
            ref.current.innerHTML = `
              <div class="mermaid-error">
                <p>⚠️ Error rendering diagram</p>
                <pre style="font-size: 10px; opacity: 0.7;">${sanitizedChart}</pre>
              </div>
            `;
          }
        }
      };

      renderDiagram();
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);


  return <div key={chart} className="mermaid" ref={ref} />;
};

export default Mermaid;
