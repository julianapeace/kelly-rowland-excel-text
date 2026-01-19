/**
 * End-to-End Encryption Module
 * Uses Web Crypto API with AES-GCM encryption
 */

class CryptoManager {
    constructor() {
        this.cryptoKey = null;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    /**
     * Derive encryption key from passphrase
     */
    async deriveKey(passphrase, salt = null) {
        // Use provided salt or generate new one
        if (!salt) {
            salt = crypto.getRandomValues(new Uint8Array(16));
        }

        // Import passphrase as key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            this.encoder.encode(passphrase),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        // Derive actual encryption key
        this.cryptoKey = await crypto.subtle.deriveKey(
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

        return salt;
    }

    /**
     * Encrypt a message
     * Returns base64 encoded string with IV prepended
     */
    async encrypt(plaintext) {
        if (!this.cryptoKey) {
            throw new Error('Encryption key not initialized');
        }

        // Generate random IV
        const iv = crypto.getRandomValues(new Uint8Array(12));

        // Encrypt the message
        const encrypted = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv: iv
            },
            this.cryptoKey,
            this.encoder.encode(plaintext)
        );

        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        // Return as base64
        return this.arrayBufferToBase64(combined);
    }

    /**
     * Decrypt a message
     * Expects base64 encoded string with IV prepended
     */
    async decrypt(encryptedBase64) {
        if (!this.cryptoKey) {
            throw new Error('Encryption key not initialized');
        }

        try {
            // Convert from base64
            const combined = this.base64ToArrayBuffer(encryptedBase64);

            // Extract IV and encrypted data
            const iv = combined.slice(0, 12);
            const encrypted = combined.slice(12);

            // Decrypt
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                this.cryptoKey,
                encrypted
            );

            return this.decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return '[🔒 Unable to decrypt - wrong passphrase?]';
        }
    }

    /**
     * Utility: Convert ArrayBuffer to base64
     */
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Utility: Convert base64 to ArrayBuffer
     */
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Generate a deterministic salt from room ID
     * This ensures all users in a room derive the same key from the same passphrase
     */
    async getRoomSalt(roomId) {
        const encoded = this.encoder.encode(roomId);
        const hash = await crypto.subtle.digest('SHA-256', encoded);
        return new Uint8Array(hash).slice(0, 16);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoManager;
}
