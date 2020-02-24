import { mount } from 'enzyme';

import { jsx } from '../src/index';
import { run, testAllRunners } from './helpers';

describe('custom properties', () => {
  testAllRunners(
    'should allow Styled dynamic interpolations',
    async runner => {
      const [code, [style]] = await runner(
        `
        import styled from 'astroturf';

        const Button = styled.button\`
          color: \${p => p.color};
        \`
      `,
        { customCssProperties: true },
      );

      const i = style.interpolations[0];

      expect(code).toContain(`vars: [["${i.id}", p => p.color]]`);
    },
  );

  testAllRunners(
    'should allow css prop dynamic interpolations ',
    async runner => {
      const [code, [style]] = await runner(
        `
      import { css } from 'astroturf';

      function Button({ color }) {
        return (
          <button
            css={\`
              color: \${color};
            \`}
          />
        );
      }
      `,
        { enableCssProp: true, customCssProperties: 'cssProp' },
      );

      const i = style.interpolations[0];

      expect(code).toContain(
        `css={[_CssProp1_button, [["${i.id}", color]], []]}`,
      );
    },
  );

  testAllRunners('should handle units correctly', async runner => {
    const [code, [style]] = await runner(
      `
      import { css } from 'astroturf';

      function Button({ duration }) {
        return (
          <button
            css={\`
              transition: \${duration}ms;
            \`}
          />
        );
      }
      `,
      { enableCssProp: true },
    );

    const i = style.interpolations[0];

    expect(code).toContain(
      `css={[_CssProp1_button, [["${i.id}", duration, "ms"]], []]}`,
    );
  });

  it('should disallow, wrong location', async () => {
    await expect(
      run(
        `
      import styled, { css } from 'astroturf';

      const ButtonA = css\`
        color: \${p => p.color};
      \`
      `,
        { enableCssProp: true },
      ),
    ).rejects.toThrow(
      /The following expression could not be evaluated during compilation\. Dynamic expressions can only be used in the context of a component, in a `css` prop, or styled\(\) component helper/,
    );
  });

  it('should disallow, wrong prop', async () => {
    await expect(
      run(
        `
      import styled, { css } from 'astroturf';

      function ButtonB({ color }) {
        return (
          <button
            className={css\`
              color: \${color};
            \`}
          />
        );
      }
      `,
        { enableCssProp: true },
      ),
    ).rejects.toThrow(
      /This css tag with dynamic expressions cannot be used with `className` prop\. Dynamic styles can only be passed to the `css` prop\. Move the style to css=\{\.\.\.\} to fix the issue/,
    );
  });

  it('should disallow when configured off, valid location', async () => {
    await expect(
      run(
        `
      import styled, { css } from 'astroturf';

      const ButtonA = styled.button\`
        color: \${p => p.color};
      \`

      function ButtonB({ color }) {
        return (
          <button
            css={\`
              color: \${color};
            \`}
          />
        );
      }
      `,
        { enableCssProp: true, customCssProperties: false },
      ),
    ).rejects.toThrow(
      /Dynamic expression compilation is not enabled\. To enable this usage set the the `customCssProperties` to `true` or `"cssProp"` in your astroturf options/,
    );
  });

  it('should disallow Styled usage when configured off', async () => {
    await expect(
      run(
        `
      import styled, { css } from 'astroturf';

      const ButtonA = styled.button\`
        color: \${p => p.color};
      \`
      `,
        { enableCssProp: true, customCssProperties: 'cssProp' },
      ),
    ).rejects.toThrow(
      /Dynamic expression compilation is not enabled\. To enable this usage set the `customCssProperties` from `"cssProp"` to `true` in your astroturf options/,
    );
  });

  it('should apply styles', () => {
    const wrapper = mount(
      jsx('div', {
        green: true,
        css: [
          {
            cls1: 'cls1',
            green: 'green',
          },
          [['aszd', 'blue']],
          [],
        ],
      }),
    );
    expect(wrapper.find('div.green')).toHaveLength(1);
    expect(wrapper.prop('style')).toEqual({
      '--aszd': 'blue',
    });
  });
});
