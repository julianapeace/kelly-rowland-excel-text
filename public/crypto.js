/**
 * End-to-End Encryption using Web Crypto API
 * AES-GCM with PBKDF2 key derivation
 */

class CryptoManager {
    constructor() {
        this.key = null;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    /**
     * Derive encryption key from passphrase
     */
    async deriveKey(passphrase, salt) {
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            this.encoder.encode(passphrase),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        this.key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Generate salt from channel ID (deterministic)
     */
    async getSalt(channelId) {
        const encoded = this.encoder.encode(channelId);
        const hash = await crypto.subtle.digest('SHA-256', encoded);
        return new Uint8Array(hash).slice(0, 16);
    }

    /**
     * Encrypt message
     */
    async encrypt(plaintext) {
        if (!this.key) throw new Error('Key not initialized');

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            this.key,
            this.encoder.encode(plaintext)
        );

        // Combine IV + encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return this.toBase64(combined);
    }

    /**
     * Decrypt message
     */
    async decrypt(encryptedBase64) {
        if (!this.key) throw new Error('Key not initialized');

        try {
            const combined = this.fromBase64(encryptedBase64);
            const iv = combined.slice(0, 12);
            const data = combined.slice(12);

            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv },
                this.key,
                data
            );

            return this.decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return '[🔒 Failed to decrypt - wrong passphrase?]';
        }
    }

    toBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    fromBase64(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }
}
