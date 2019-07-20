import { Exclude, Expose } from 'class-transformer';
import ow from 'ow';
import { Chainable } from '../base';

@Expose()
abstract class Field {
    public readonly required?: false;
    constructor(
        public readonly key: string,
        public readonly label?: string,
        public readonly hint?: string,
        required: boolean = false,
    ) {
        ow(key, ow.string.nonEmpty);
        ow(key, ow.string.matches(/[0-9a-z-\/]+/i));
        if (!required) {
            this.required = required;
        }
    }
}
@Expose()
export class TextField extends Field {
    private readonly default?: string;
    constructor(
        key: string,
        label?: string,
        hint?: string,
        required: boolean = true,
        defaultValue?: string,
    ) {
        super(key, label, hint, required);
        this.default = defaultValue;
    }
}
export class Option {
    constructor(
        private readonly label: string,
        private readonly value: string,
    ) {
        ow(label, ow.string.nonEmpty);
        ow(value, ow.string.nonEmpty);
    }
}
@Expose()
export class SelectField extends Field {
    private options: Option[] = [];
    private readonly multiple?: true;
    private readonly default?: string | string[];
    constructor(
        key: string,
        label?: string,
        hint?: string,
        required?: boolean,
        multiple?: false,
        defaultValue?: string,
    );
    constructor(
        key: string,
        label?: string,
        hint?: string,
        required?: boolean,
        multiple?: true,
        defaultValue?: string | string[],
    );
    constructor(
        key: string,
        label?: string,
        hint?: string,
        required: boolean = true,
        multiple: boolean = false,
        defaultValue?: string | string[],
    ) {
        super(key, label, hint, required);
        this.default = defaultValue;
        if (multiple) {
            this.multiple = multiple;
        }
    }
    addOption(option: Option) {
        this.options.push(option);
        return this;
    }
}
export interface Fields<T> {
    add(field: Field): T;
}

@Exclude()
export class FieldsImpl<T> extends Chainable<T> implements Fields<T> {
    fields: Map<string, Field> = new Map();
    add(field: Field): T {
        this.fields.set(field.key, field);
        return this.parent;
    }
    hasFields(): boolean {
        return this.fields.size > 0;
    }
}
